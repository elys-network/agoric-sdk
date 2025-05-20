#!/usr/bin/env python3
"""
Plot memory growth data from Agoric SwingSet performance data.
This script analyzes snapshot sizes across vats to identify memory leaks.
"""

import json
import argparse
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description='Plot memory growth from snapshot data')
    parser.add_argument('input_file', help='Path to JSON lines file with iteration stats')
    parser.add_argument('--output', '-o', help='Output file path for the plot (PNG, PDF, SVG)')
    parser.add_argument('--top', '-t', type=int, default=5,
                       help='Show only top N vats by growth')
    parser.add_argument('--all-vats', '-a', action='store_true',
                       help='Plot all vats instead of just the growing ones')
    parser.add_argument('--format', '-f', choices=['single', 'grid'], default='grid',
                       help='Plot format: single plot or grid of subplots')
    return parser.parse_args()


def load_data(file_path):
    """Load data from a JSONL file."""
    try:
        with open(file_path, 'r') as f:
            lines = f.readlines()
            
        # Parse each line as JSON
        data = [json.loads(line.strip()) for line in lines if line.strip()]
        df = pd.DataFrame.from_records(data)
        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        return None


def process_snapshots(df):
    """Process snapshot data from dataframe."""
    if 'snapshots' not in df.columns:
        print("Error: 'snapshots' column not found in the data")
        return None
    
    # Drop rows with no snapshot data
    df = df.dropna(subset=['snapshots'])
    
    # Create empty list to collect all records
    records = []
    
    # Process each row (iteration)
    for iter_val, row in df.iterrows():
        if not isinstance(row['snapshots'], list):
            continue
            
        # Process each vat's snapshot
        for vat_snapshot in row['snapshots']:
            if not isinstance(vat_snapshot, dict):
                continue
                
            # Create record with iteration and all vat snapshot data
            record = {'iter': iter_val}
            if 'elapsed' in row:
                record['elapsed'] = row['elapsed']
                
            # Add all fields from the vat snapshot
            record.update(vat_snapshot)
            records.append(record)
    
    if not records:
        print("No valid snapshot records found")
        return None
        
    # Create DataFrame from records
    snapshot_df = pd.DataFrame.from_records(records)
    
    # Process vatID for sorting
    if 'vatID' in snapshot_df.columns:
        # Convert vatIDs from format 'v123' to numeric value 123
        try:
            snapshot_df['vatNumID'] = snapshot_df['vatID'].str.replace('v', '').astype(int)
        except:
            snapshot_df['vatNumID'] = snapshot_df['vatID']
    
    # Mark active snapshots (when snapPos changes)
    if 'snapPos' in snapshot_df.columns:
        snapshot_df = snapshot_df.sort_values(['vatID', 'iter'])
        snapshot_df['active'] = snapshot_df['snapPos'] != snapshot_df['snapPos'].shift()
    
    return snapshot_df


def calculate_growth(snapshots_df):
    """Calculate growth rates per vat."""
    if snapshots_df is None or len(snapshots_df) == 0:
        return None
    
    # Only use active snapshots if we have that information
    if 'active' in snapshots_df.columns:
        df = snapshots_df[snapshots_df['active'] == True].copy()
    else:
        df = snapshots_df.copy()
    
    # Only use records with size information
    if 'uncompressedSize' not in df.columns:
        print("Error: 'uncompressedSize' column not found in the snapshot data")
        return None
    
    df = df.dropna(subset=['uncompressedSize'])
    
    # Group by vatID
    vat_groups = df.groupby('vatID')
    
    # Calculate statistics for each vat
    growth_stats = []
    
    for vatID, group in vat_groups:
        if len(group) <= 1:
            # Need at least 2 points to calculate growth
            continue
            
        # Sort by iteration
        group = group.sort_values('iter')
        
        # Calculate growth rate with linear regression
        x = np.array(group['iter'].astype(float))
        y = np.array(group['uncompressedSize'].astype(float))
        
        if len(x) >= 2:
            m, b = np.polyfit(x, y, 1)
            
            # Record statistics
            stats = {
                'vatID': vatID,
                'slope': m,  # bytes per iteration
                'intercept': b,
                'min_size': y.min(),
                'max_size': y.max(),
                'growth_pct': (y[-1] - y[0]) / y[0] * 100 if y[0] > 0 else 0,
                'count': len(group),
                'initial_iter': x[0],
                'final_iter': x[-1]
            }
            growth_stats.append(stats)
    
    if not growth_stats:
        print("No growth statistics could be calculated")
        return None
        
    # Convert to DataFrame
    growth_df = pd.DataFrame(growth_stats)
    return growth_df


def plot_memory_growth(snapshots_df, growth_df, args):
    """Plot memory growth data."""
    if snapshots_df is None or growth_df is None:
        return False
    
    # Select vats to display
    if not args.all_vats:
        # Sort by slope (growth rate) and get top N
        display_vats = growth_df.sort_values('slope', ascending=False).head(args.top)['vatID'].tolist()
    else:
        display_vats = growth_df['vatID'].unique().tolist()
    
    # Filter snapshot data to only include selected vats
    plot_df = snapshots_df[snapshots_df['vatID'].isin(display_vats)].copy()
    
    # If we have active snapshot information, use it
    if 'active' in plot_df.columns:
        plot_df = plot_df[plot_df['active'] == True]
    
    # Check we have data to plot
    if len(plot_df) == 0:
        print("No data to plot after filtering")
        return False
    
    # Decide on plot format
    if args.format == 'single':
        fig, ax = plt.subplots(figsize=(12, 8))
        
        # For each vat, plot the memory usage over iterations
        for vatID in display_vats:
            vat_data = plot_df[plot_df['vatID'] == vatID]
            if len(vat_data) > 1:
                ax.plot(vat_data['iter'], vat_data['uncompressedSize'], 
                        marker='o', linestyle='-', label=f"{vatID}")
        
        ax.set_xlabel('Iteration')
        ax.set_ylabel('Memory Usage (bytes)')
        ax.set_title('Memory Growth by Vat')
        ax.grid(True, alpha=0.3)
        ax.legend()
        
    else:  # Grid format
        # Calculate grid dimensions
        num_vats = len(display_vats)
        cols = min(3, num_vats)
        rows = (num_vats + cols - 1) // cols
        
        fig, axes = plt.subplots(rows, cols, figsize=(15, rows * 4), squeeze=False)
        axes = axes.flatten()
        
        # For each vat, create a subplot
        for i, vatID in enumerate(display_vats):
            if i >= len(axes):
                break
                
            ax = axes[i]
            vat_data = plot_df[plot_df['vatID'] == vatID]
            
            if len(vat_data) > 1:
                # Get growth info for this vat
                vat_growth = growth_df[growth_df['vatID'] == vatID]
                growth_rate = vat_growth['slope'].values[0] if len(vat_growth) > 0 else 0
                
                # Plot the data
                ax.plot(vat_data['iter'], vat_data['uncompressedSize'], 
                        marker='o', linestyle='-')
                
                # Add trend line
                x = np.array(vat_data['iter'].astype(float))
                y = np.array(vat_data['uncompressedSize'].astype(float))
                if len(x) >= 2:
                    m, b = np.polyfit(x, y, 1)
                    ax.plot(x, m*x + b, 'r--', 
                            label=f'Trend: {m:.2f} bytes/iter')
                
                ax.set_title(f"Vat {vatID}: {growth_rate:.2f} bytes/iter")
                ax.set_xlabel('Iteration')
                ax.set_ylabel('Memory (bytes)')
                ax.grid(True, alpha=0.3)
                ax.legend()
        
        # Hide unused subplots
        for j in range(i+1, len(axes)):
            axes[j].axis('off')
        
        plt.tight_layout()
    
    # Save or show the plot
    if args.output:
        plt.savefig(args.output, bbox_inches='tight', dpi=300)
        print(f"Plot saved to {args.output}")
    else:
        plt.show()
    
    # Print summary statistics
    print("\nMemory Growth Statistics (sorted by growth rate):")
    summary = growth_df[['vatID', 'slope', 'growth_pct', 'min_size', 'max_size', 'count']]
    summary = summary.sort_values('slope', ascending=False)
    
    # Convert bytes to KB for better readability
    summary['slope_kb'] = summary['slope'] / 1024
    summary['min_size_kb'] = summary['min_size'] / 1024
    summary['max_size_kb'] = summary['max_size'] / 1024
    
    print(summary[['vatID', 'slope_kb', 'growth_pct', 'min_size_kb', 'max_size_kb', 'count']].head(10).to_string(
        float_format=lambda x: f"{x:.2f}"
    ))
    
    return True


def main():
    """Main entry point."""
    args = parse_args()
    
    # Validate input file exists
    input_path = Path(args.input_file)
    if not input_path.exists():
        print(f"Error: Input file {args.input_file} does not exist")
        return 1
    
    # Load the data
    df = load_data(args.input_file)
    if df is None:
        return 1
    
    # Process snapshot data
    snapshots_df = process_snapshots(df)
    if snapshots_df is None:
        return 1
    
    # Calculate growth statistics
    growth_df = calculate_growth(snapshots_df)
    if growth_df is None:
        return 1
    
    # Plot the data
    if not plot_memory_growth(snapshots_df, growth_df, args):
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
