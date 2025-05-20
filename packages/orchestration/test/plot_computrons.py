#!/usr/bin/env python3
"""
Plot computron usage over iterations from Agoric SwingSet performance data.
This script visualizes the computational cost trends in JSON log files.
"""

import json
import argparse
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description='Plot computrons over iterations')
    parser.add_argument('input_file', help='Path to JSON lines file with iteration stats')
    parser.add_argument('--output', '-o', help='Output file path for the plot (PNG, PDF, SVG)')
    parser.add_argument('--title', '-t', default='Computron Usage Over Iterations',
                      help='Title for the plot')
    parser.add_argument('--skip', '-s', type=int, default=0,
                      help='Skip first N iterations (often noisy during bootstrap)')
    parser.add_argument('--trend', action='store_true',
                      help='Add linear trend line to the plot')
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


def plot_computrons(df, args):
    """Plot computrons over iterations."""
    if 'computrons' not in df.columns:
        print("Error: 'computrons' column not found in the data")
        return False
    
    # Clean the data
    df = df.dropna(subset=['computrons'])
    
    # Convert computrons to numeric if it's not already
    if not pd.api.types.is_numeric_dtype(df['computrons']):
        df['computrons'] = pd.to_numeric(df['computrons'], errors='coerce')
    
    # Skip initial iterations if requested
    if args.skip > 0 and len(df) > args.skip:
        plot_df = df.iloc[args.skip:]
    else:
        plot_df = df
    
    # Create the plot
    plt.figure(figsize=(12, 6))
    
    # Plot computrons
    plt.plot(plot_df.index, plot_df['computrons'], marker='o', linestyle='-', markersize=4)
    
    # Add trend line if requested
    if args.trend and len(plot_df) > 1:
        x = np.array(plot_df.index)
        y = np.array(plot_df['computrons'])
        m, b = np.polyfit(x, y, 1)
        plt.plot(x, m*x + b, 'r--', label=f'Trend: {m:.2f}x + {b:.2f}')
        plt.legend()
    
    # Add labels and title
    plt.xlabel('Iteration')
    plt.ylabel('Computrons')
    plt.title(args.title)
    plt.grid(True, alpha=0.3)
    
    # Save or show the plot
    if args.output:
        plt.savefig(args.output, bbox_inches='tight', dpi=300)
        print(f"Plot saved to {args.output}")
    else:
        plt.show()
    
    # Calculate and print statistics
    stats = df['computrons'].describe()
    growth_rate = None
    if len(plot_df) > 1:
        x = np.array(plot_df.index)
        y = np.array(plot_df['computrons'])
        m, b = np.polyfit(x, y, 1)
        growth_rate = m
    
    print("\nComputron Statistics:")
    print(f"Count: {stats['count']}")
    print(f"Mean: {stats['mean']:.2f}")
    print(f"Min: {stats['min']:.2f}")
    print(f"Max: {stats['max']:.2f}")
    if growth_rate is not None:
        print(f"Growth rate per iteration: {growth_rate:.2f}")
    
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
    
    # Plot the data
    if not plot_computrons(df, args):
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
