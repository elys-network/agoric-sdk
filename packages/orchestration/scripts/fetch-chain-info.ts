#!/usr/bin/env tsx
/** @file Fetch canonical chain info to generate the minimum needed for agoricNames */
import {
  State as IBCChannelState,
  Order,
} from '@agoric/cosmic-proto/ibc/core/channel/v1/channel.js';
import { State as IBCConnectionState } from '@agoric/cosmic-proto/ibc/core/connection/v1/connection.js';
import type { IBCChannelID, IBCConnectionID } from '@agoric/vats';
import { ChainRegistryClient } from '@chain-registry/client';
import type { IBCInfo } from '@chain-registry/types';
import assert from 'node:assert';
import fsp from 'node:fs/promises';
import prettier from 'prettier';
import type { CosmosChainInfo, IBCConnectionInfo } from '../src/cosmos-api.js';

// XXX script assumes it's run from the package path
// XXX .json would be more apt; UNTIL https://github.com/endojs/endo/issues/2110
const outputFile = 'src/fetched-chain-info.js';

/**
 * Names for which to fetch info
 */
const chainNames = [
  'agoric',
  'celestia',
  'cosmoshub',
  'dydx',
  'juno',
  'neutron',
  'noble',
  'omniflixhub',
  'osmosis',
  'secretnetwork',
  'stargaze',
  'stride',
];

const client = new ChainRegistryClient({
  chainNames,
});

// chain info, assets and ibc data will be downloaded dynamically by invoking fetchUrls method
await client.fetchUrls();

const chainInfo = {} as Record<string, CosmosChainInfo>;

function toConnectionEntry(ibcInfo: IBCInfo, name: string) {
  // IbcInfo encodes the undirected edge as a tuple of (chain_1, chain_2) in alphabetical order
  const fromChain1 = ibcInfo.chain_1.chain_name === name;
  const [from, to] = fromChain1
    ? [ibcInfo.chain_1, ibcInfo.chain_2]
    : [ibcInfo.chain_2, ibcInfo.chain_1];
  assert.equal(from.chain_name, name);
  const transferChannels = ibcInfo.channels.filter(
    c =>
      c.chain_1.port_id === 'transfer' &&
      // @ts-expect-error tags does not specify keys
      c.tags?.preferred,
  );
  if (transferChannels.length === 0) {
    console.warn(
      'no transfer channel for [',
      from.chain_name,
      to.chain_name,
      ']',
      '(skipping)',
    );
    return [];
  }
  if (transferChannels.length > 1) {
    console.warn(
      'multiple preferred transfer channels [',
      from.chain_name,
      to.chain_name,
      ']:',
      transferChannels,
      '(choosing first)',
    );
  }
  const [channel] = transferChannels;
  const [channelFrom, channelTo] = fromChain1
    ? [channel.chain_2, channel.chain_1]
    : [channel.chain_1, channel.chain_2];
  const record = {
    id: from.connection_id as IBCConnectionID,
    client_id: from.client_id,
    counterparty: {
      client_id: to.client_id,
      connection_id: to.connection_id as IBCConnectionID,
      prefix: {
        key_prefix: 'FIXME',
      },
    },
    state: IBCConnectionState.STATE_OPEN, // XXX presumably
    transferChannel: {
      channelId: channelFrom.channel_id as IBCChannelID,
      portId: channelFrom.port_id,
      counterPartyChannelId: channelTo.channel_id as IBCChannelID,
      counterPartyPortId: channelTo.port_id,
      // FIXME mapping, our guard expects a numerical enum
      ordering: Order.ORDER_NONE_UNSPECIFIED,
      state: IBCChannelState.STATE_OPEN, // XXX presumably
      version: channel.version,
    },
  } as IBCConnectionInfo;
  const destChainId = chainInfo[to.chain_name].chainId;
  return [destChainId, record] as const;
}

for (const name of chainNames) {
  console.log('processing info', name);

  const chain = client.getChain(name);
  chainInfo[name] = {
    chainId: chain.chain_id,
    stakingTokens: chain.staking?.staking_tokens,
  };
}
// UNTIL https://github.com/Agoric/agoric-sdk/issues/9326
chainInfo.osmosis = { ...chainInfo.osmosis, icqEnabled: true };

// iterate this after chainInfo is filled out
for (const name of chainNames) {
  console.log('processing connections', name);

  const ibcData = client.getChainIbcData(name);
  const connections = Object.fromEntries(
    ibcData
      .map(datum => toConnectionEntry(datum, name))
      // sort alphabetically for consistency
      .sort(([a], [b]) => a?.localeCompare(b)),
  );
  chainInfo[name] = { ...chainInfo[name], connections };
}

const record = JSON.stringify(chainInfo, null, 2);
const src = `/** @file Generated by fetch-chain-info.ts */\nexport default /** @type {const} } */ (${record});`;
const prettySrc = await prettier.format(src, {
  parser: 'babel', // 'typescript' fails to preserve parens for typecast
  singleQuote: true,
  trailingComma: 'all',
});
await fsp.writeFile(outputFile, prettySrc);
