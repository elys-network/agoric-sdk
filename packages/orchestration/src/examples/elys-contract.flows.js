import { Fail } from '@endo/errors';
import { makeTracer } from '@agoric/internal';
import {
  decodeBech32,
  encodeBech32,
} from '@agoric/cosmic-proto/address-hooks.js';
import { Any } from '@agoric/cosmic-proto/google/protobuf/any.js';
// import {
//   MsgLiquidStake,
//   MsgLiquidStakeResponse,
//   MsgRedeemStake,
// } from '@agoric/cosmic-proto/stride/stakeibc/tx.js';
import {
  MsgLiquidStake,
  MsgLiquidStakeResponse,
  MsgRedeemStake,
} from '@agoric/cosmic-proto/stride/staketia/tx.js';
import { tryDecodeResponse } from '../utils/cosmos.js';
import { denomHash, denomHashFromPath } from '../utils/denomHash.js';

/**
 * @import {GuestInterface} from '@agoric/async-flow';
 * @import {Orchestrator, OrchestrationFlow, Bech32Address} from '@agoric/orchestration';
 * @import {SupportedHostChainShape, StrideStakingTapState} from './elys.contract.js';
 * @import {ChainHub} from '../exos/chain-hub.js';
 * @import {Passable} from '@endo/pass-style';
 * @import {Coin} from '@agoric/cosmic-proto/cosmos/base/v1beta1/coin.js';
 * @import {VTransferIBCEvent} from '@agoric/vats';
 * @import {CosmosChainAddress, OrchestrationAccount} from '@agoric/orchestration';
 * @import {FungibleTokenPacketData} from '@agoric/cosmic-proto/ibc/applications/transfer/v2/packet.js';
 * @import {Guarded} from '@endo/exo';
 * @import {FeeConfigShape} from './elys-contract-type-gaurd.js';
 */
const trace = makeTracer('StrideStakingFlow');

/**
 * @satisfies {OrchestrationFlow}
 * @param {Orchestrator} orch
 * @param {{
 *   makeStrideStakingTap: (
 *     initialState: StrideStakingTapState,
 *   ) => Guarded<{ receiveUpcall: (event: VTransferIBCEvent) => void }>;
 *   chainHub: GuestInterface<ChainHub>;
 * }} ctx
 * @param {{
 *   chainNames: string[];
 *   supportedHostChains: MapStore<any, any>;
 *   stDenomOnElysTohostToAgoricChannelMap: MapStore<any, any>;
 *   feeConfig: FeeConfigShape;
 * }} offerArgs
 */
export const makeICAHookAccounts = async (
  orch,
  { makeStrideStakingTap, chainHub },
  {
    chainNames,
    supportedHostChains,
    stDenomOnElysTohostToAgoricChannelMap,
    feeConfig,
  },
) => {
  trace('Fetching all chains...');
  const allRemoteChains = await Promise.all(
    chainNames.map(n => orch.getChain(n)),
  );
  trace('Fetching Agoric chainInfo...');
  // Agoric local account
  const agoric = await orch.getChain('agoric');
  const { chainId: agoricChainId, bech32Prefix: agoricBech32Prefix } =
    await agoric.getChainInfo();
  trace('Creating local Agoric account...');
  const localAccount = await agoric.makeAccount();
  const localAccountAddress = localAccount.getAddress();
  trace('Agoric local account Address: ', localAccountAddress);

  trace('Fetching Elys chainInfo...');
  // Elys ICA account
  const elys = await orch.getChain('elys');
  const { chainId: elysChainId, bech32Prefix: elysBech32Prefix } =
    await elys.getChainInfo();
  trace(`Elys chainId: ${elysChainId}`);
  let elysICAAccount;
  let elysICAAddress;
  try {
    trace('Creating Elys account on Elys...');
    elysICAAccount = await elys.makeAccount();
    elysICAAddress = elysICAAccount.getAddress();
    trace('Elys ICA created:', elysICAAddress);
  } catch (err) {
    trace('Failed to create Elys ICA account:', err);
    throw err;
  }

  trace('Fetching Stride chainInfo...');
  // stride ICA account
  const stride = await orch.getChain('stride');
  const { chainId: strideChainId, bech32Prefix: strideBech32Prefix } =
    await stride.getChainInfo();
  trace('Creating ICA account on Stride...');
  const strideICAAccount = await stride.makeAccount();
  const strideICAAddress = strideICAAccount.getAddress();
  trace(
    '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++Stride ICA Account Address: ',
    strideICAAddress.value,
  );

  const { transferChannel: transferChannelAgoricElys } =
    await chainHub.getConnectionInfo(agoricChainId, elysChainId);
  const { transferChannel: transferChannelStrideElys } =
    await chainHub.getConnectionInfo(strideChainId, elysChainId);

  trace('StrideElys channelId: ', transferChannelStrideElys.channelId);
  trace('AgoricElys channelId: ', transferChannelAgoricElys.channelId);

  //TEST From Agoric local account transfer 1bld to elys1j3ut8walawveh8j0en2alyed983rfqqlef8600
  // const testReceiverAddress = {
  //   chainId: elysChainId,
  //   encoding: localAccountAddress.encoding,
  //   /** @type {`${string}1${string}`} */
  //   value: 'elys1j3ut8walawveh8j0en2alyed983rfqqlef8600',
  // };
  // localAccount.transfer(testReceiverAddress, {
  //       denom: 'ubld',
  //       value: 100000n,
  //     });

  localAccount.getBalances().then(balances => {
    trace('Local account balances: ', balances);
  });

  trace('Connecting with all supported chanins...');
  // ICA account on all the supported host chains
  for (const [_index, remoteChain] of allRemoteChains.entries()) {
    const chainInfo = await remoteChain.getChainInfo();
    const { chainId, stakingTokens, bech32Prefix } = chainInfo;
    trace(`Updating data for ${chainId}...`);
    stakingTokens || Fail`${chainId} does not have stakingTokens in config`;

    const nativeDenom = stakingTokens[0].denom;
    trace('NativeDenom ', nativeDenom);
    nativeDenom ||
      Fail`${chainId || chainId} does not have stakingTokens in config`;

    const ICAAccount = await remoteChain.makeAccount();
    const ICAAddress = ICAAccount.getAddress();
    trace('Remote Chain ICA Account Address: ', ICAAddress.value);

    // get the connection info between agoric and remote chain
    const { transferChannel } = await chainHub.getConnectionInfo(
      agoricChainId,
      chainId,
    );
    const { transferChannel: transferChannelhostStride } =
      await chainHub.getConnectionInfo(strideChainId, chainId);

    const ibcDenomOnAgoric = `ibc/${denomHash({ denom: nativeDenom, channelId: transferChannel.channelId })}`;
    const ibcDenomOnStride = `ibc/${denomHash({ denom: nativeDenom, channelId: transferChannelhostStride.channelId })}`;

    trace('ibcDenomOnAgoric ', ibcDenomOnAgoric);
    trace('nativeDenom ', nativeDenom);
    trace('ibcDenomOnStride ', ibcDenomOnStride);

    // Required in retrieving native token back from stTokens on elys chain
    let stTokenDenomOnElys = `ibc/${denomHash({ denom: `st${nativeDenom}`, channelId: transferChannelStrideElys.counterPartyChannelId })}`;
    stTokenDenomOnElys = `transfer/${transferChannelStrideElys.counterPartyChannelId}/st${nativeDenom}`;
    trace('stTokenDenomOnElys ', stTokenDenomOnElys);
    //TODO: remove hardcoded value used here for debugging

    try {
      stDenomOnElysTohostToAgoricChannelMap.init(
        stTokenDenomOnElys,
        transferChannel.counterPartyChannelId,
      );
    } catch (error) {
      trace(
        `Error initializing stDenomOnElysTohostToAgoricChannelMap for ${stTokenDenomOnElys}:`,
        error,
      );
    }

    /** @type {SupportedHostChainShape} */
    const hostChainInfo = {
      hostToAgoricChannel: transferChannel.counterPartyChannelId,
      nativeDenom,
      ibcDenomOnAgoric,
      ibcDenomOnStride,
      hostICAAccount: ICAAccount,
      hostICAAccountAddress: ICAAddress,
      bech32Prefix,
    };
    supportedHostChains.init(
      transferChannel.counterPartyChannelId,
      hostChainInfo,
    );
  }

  /** @type {StrideStakingTapState & Passable} */
  const s = {
    // @ts-expect-error LocalOrchestrationAccount vs. OrchestrationAccount<any>
    localAccount,
    localAccountAddress,
    strideICAAccount,
    strideICAAddress,
    elysICAAccount,
    elysICAAddress,
    supportedHostChains,
    elysToAgoricChannel: transferChannelAgoricElys.counterPartyChannelId,
    AgoricToElysChannel: transferChannelAgoricElys.channelId,
    stDenomOnElysTohostToAgoricChannelMap,
    agoricBech32Prefix,
    strideBech32Prefix,
    elysBech32Prefix,
    feeConfig,
  };
  const tap = makeStrideStakingTap(s);

  // @ts-expect-error tap.receiveUpcall: 'Vow<void> | undefined' not assignable to 'Promise<any>'
  await localAccount.monitorTransfers(tap);

  trace('Done with makeICAHookAccounts++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
  return localAccount;
};
harden(makeICAHookAccounts);

/**
 * @satisfies {OrchestrationFlow}
 * @param {Orchestrator} orch
 * @param {object} ctx
 * @param {VTransferIBCEvent & Passable} incomingIbcTransferEvent
 * @param {OrchestrationAccount<{ chainId: string }> & Passable} localAccount
 * @param {CosmosChainAddress} localAccountAddress
 * @param {OrchestrationAccount<{ chainId: string }> & Passable} strideICAAccount
 * @param {CosmosChainAddress} strideICAAddress
 * @param {OrchestrationAccount<{ chainId: string }> & Passable} elysICAAccount
 * @param {CosmosChainAddress} elysICAAddress
 * @param {MapStore<string, SupportedHostChainShape>} supportedHostChains
 * @param {string} elysToAgoricChannel
 * @param {string} AgoricToElysChannel
 * @param {MapStore<string, string>} stDenomOnElysTohostToAgoricChannelMap
 * @param {string} agoricBech32Prefix
 * @param {string} strideBech32Prefix
 * @param {string} elysBech32Prefix
 * @param {FeeConfigShape} feeConfig
 */
// * @param {StrideStakingTapState & Passable} state/
export const tokenMovementAndStrideLSDFlow = async (
  orch,
  ctx,
  incomingIbcTransferEvent,
  localAccount,
  localAccountAddress,
  strideICAAccount,
  strideICAAddress,
  elysICAAccount,
  elysICAAddress,
  supportedHostChains,
  elysToAgoricChannel,
  AgoricToElysChannel,
  stDenomOnElysTohostToAgoricChannelMap,
  agoricBech32Prefix,
  strideBech32Prefix,
  elysBech32Prefix,
  feeConfig,
) => {
  trace(
    'tokenMovementAndStrideLSDFlow called with event:',
    incomingIbcTransferEvent,
  );
  // Look for interested incoming tokens
  // Either supported chains Staking denoms or stTokens from elys chain
  const stakeToStride = supportedHostChains.has(
    incomingIbcTransferEvent.packet.source_channel,
  );
  trace(`stakeToStride: ${stakeToStride}`);
  trace(
    `packet source channel: ${incomingIbcTransferEvent.packet.source_channel}`,
  );

  const redeemFromStride =
    incomingIbcTransferEvent.packet.source_channel === elysToAgoricChannel;
  if (!stakeToStride && !redeemFromStride) {
    return;
  }

  const tx = /** @type {FungibleTokenPacketData} */ (
    JSON.parse(atob(incomingIbcTransferEvent.packet.data))
  );

  trace('Received Fungible Token Packet Data', tx);

  // ignore the outgoing transfers
  if (tx.receiver !== localAccountAddress.value) {
    return;
  }

  const senderAgoricAddress = deriveAddress(tx.sender, agoricBech32Prefix);
  const senderStrideAddress = deriveAddress(tx.sender, strideBech32Prefix);
  const senderElysAddress = deriveAddress(tx.sender, elysBech32Prefix);

  trace('senderAgoricAddress: ', senderAgoricAddress);
  trace('senderStrideAddress: ', senderStrideAddress);
  trace('senderElysAddress: ', senderElysAddress);

  const senderAgoricChainAddress = {
    chainId: localAccountAddress.chainId,
    encoding: localAccountAddress.encoding,
    value: senderAgoricAddress,
  };
  const senderStrideChainAddress = {
    chainId: strideICAAddress.chainId,
    encoding: strideICAAddress.encoding,
    value: senderStrideAddress,
  };
  const senderElysChainAddress = {
    chainId: elysICAAddress.chainId,
    encoding: elysICAAddress.encoding,
    value: senderElysAddress,
  };

  // https://github.com/Agoric/agoric-sdk/wiki/No-Nested-Await
  await null;

  // Receiving tokens for liquid staking
  if (stakeToStride && !redeemFromStride) {
    const hostChainInfo = supportedHostChains.get(
      incomingIbcTransferEvent.packet.source_channel,
    );

    if (tx.denom !== hostChainInfo.nativeDenom) {
      return;
    }
    let incomingTokenAmount;
    const incomingTokenIBCDenom = hostChainInfo.ibcDenomOnAgoric;
    try {
      incomingTokenAmount = BigInt(tx.amount);
    } catch (error) {
      trace('Error converting tx.amount to BigInt', error);
      return;
    }

    let amountAfterFeeDeduction;
    // deduct fees
    try {
      amountAfterFeeDeduction = await deductedFeeAmount(
        localAccount,
        feeConfig,
        incomingTokenAmount,
        incomingTokenIBCDenom,
        true,
      );
      trace('amount after fee deduction', amountAfterFeeDeduction);
    } catch (error) {
      trace('Error deducting fees', error);
      return;
    }

    // Move to host chain ICA account
    try {
      await moveToHostChain(
        localAccount,
        hostChainInfo.hostICAAccountAddress,
        hostChainInfo.ibcDenomOnAgoric,
        amountAfterFeeDeduction,
      );
    } catch (error) {
      await handleTransferFailure(
        localAccount,
        senderAgoricChainAddress,
        hostChainInfo.ibcDenomOnAgoric,
        amountAfterFeeDeduction,
        `Moving tokens from agoric to host-chain failed with error: ${error}, sending it to users wallet on agoric chain`,
      );
      return;
    }

    // Move to stride ICA from host ICA account
    const senderHostChainAddress = {
      chainId: hostChainInfo.hostICAAccountAddress.chainId,
      encoding: hostChainInfo.hostICAAccountAddress.encoding,
      value: convertToBech32Address(tx.sender),
    };
    try {
      trace('Moving tokens to stride from host-chain');
      await hostChainInfo.hostICAAccount.transfer(strideICAAddress, {
        denom: tx.denom,
        value: amountAfterFeeDeduction,
      });
      trace('Moved tokens to stride ICA account');
    } catch (error) {
      await handleTransferFailure(
        hostChainInfo.hostICAAccount,
        senderHostChainAddress,
        tx.denom,
        amountAfterFeeDeduction,
        `Moving tokens to stride from host-chain failed with error: ${error}, sending it to users wallet on host chain`,
      );
      return;
    }
    // Liquid stake on stride chain
    /** @type {MsgLiquidStakeResponse} */
    let stakingResponse;
    try {
      stakingResponse = await liquidStakeOnStride(
        strideICAAccount,
        strideICAAddress,
        amountAfterFeeDeduction,
        tx.denom,
      );
    } catch (error) {
      await handleTransferFailure(
        strideICAAccount,
        senderStrideChainAddress,
        hostChainInfo.ibcDenomOnStride,
        amountAfterFeeDeduction,
        `Liquid staking failed with error: ${error}, sending tokens to users wallet on stride chain`,
      );
      return;
    }
    // Move stTokens to Elys chain
    try {
      await moveStTokensToElys(
        strideICAAccount,
        senderElysChainAddress,
        stakingResponse.stToken,
      );
    } catch (error) {
      await handleTransferFailure(
        strideICAAccount,
        senderStrideChainAddress,
        stakingResponse.stToken.denom,
        BigInt(stakingResponse.stToken.amount),
        `Moving stTokens to elys from stride chain failed with error: ${error}, sending it to users wallet on stride chain`,
      );
    }
    trace(`Liquid stake on stride successful, stToken: ${stakingResponse.stToken.denom}, amount: ${stakingResponse.stToken.amount}`);
  
  } else {
    trace('Redeeming stTokens from Elys to Stride');
    const hostToAgoricChannel = stDenomOnElysTohostToAgoricChannelMap.get(
      tx.denom,
    );
    trace(`hostToAgoricChannel for ${tx.denom} is ${hostToAgoricChannel}`);

    const hostChain = supportedHostChains.get(hostToAgoricChannel);

    trace(
      `hostChain for ${tx.denom} is ${hostChain.hostICAAccountAddress.chainId}`,
    );
    let incomingStTokenAmount;
    try {
      incomingStTokenAmount = BigInt(tx.amount);
    } catch (error) {
      trace('Error converting tx.amount to BigInt', error);
      return;
    }

    trace(AgoricToElysChannel);
    const ibcDenomOnAgoricFromElys = `ibc/${denomHash({ denom: tx.denom, channelId: AgoricToElysChannel })}`;
    trace(`LiquidStakeRedeem: Received ${tx.denom}`);
    trace(`LiquidStakeRedeem: Moving ${ibcDenomOnAgoricFromElys} to elys ICA`);

    let amountAfterFeeDeduction;
    // deduct fees
    try {
      amountAfterFeeDeduction = await deductedFeeAmount(
        localAccount,
        feeConfig,
        incomingStTokenAmount,
        ibcDenomOnAgoricFromElys,
        false,
      );
      trace('amount after fee deduction', amountAfterFeeDeduction);
    } catch (error) {
      trace('Error deducting fees', error);
      return;
    }

    // Transfer to elys ICA account
    try {
      await localAccount.transfer(elysICAAddress, {
        denom: ibcDenomOnAgoricFromElys,
        value: amountAfterFeeDeduction,
      });
    } catch (error) {
      await handleTransferFailure(
        localAccount,
        senderAgoricChainAddress,
        ibcDenomOnAgoricFromElys,
        amountAfterFeeDeduction,
        `Moving stTokens to elys ICA from agoric chain failed with error: ${error}, sending it to users wallet on agoric chain`,
      );
      return;
    }
    // Transfer to stride from elys ICA
    try {
      await elysICAAccount.transfer(strideICAAddress, {
        denom: `ibc/${denomHashFromPath(tx.denom)}`,
        value: amountAfterFeeDeduction,
      });
    } catch (error) {
      await handleTransferFailure(
        elysICAAccount,
        senderElysChainAddress,
        tx.denom,
        amountAfterFeeDeduction,
        `Moving stTokens to stride ICA from elys ICA failed with error: ${error}, sending it to users wallet on elys chain`,
      );
      return;
    }
    // Redeem on stride chain
    try {
      const senderNativeAddress = deriveAddress(
        tx.sender,
        hostChain.bech32Prefix,
      );
      trace(
        `Derived Native address from elys address ${tx.sender} is ${senderNativeAddress}`,
      );

      await redeemOnStride(
        strideICAAccount,
        strideICAAddress,
        `${amountAfterFeeDeduction}`,
        hostChain.hostICAAccountAddress.chainId,
        senderNativeAddress,
      );
    } catch (error) {
      await handleTransferFailure(
        strideICAAccount,
        senderStrideChainAddress,
        `st${hostChain.nativeDenom}`,
        amountAfterFeeDeduction,
        `Unstaking on stride failed with error: ${error}, sending it to users wallet on stride chain`,
      );
    }
    trace(
      `Redeem on stride successful, stToken: st${hostChain.nativeDenom}, amount: ${tx.amount}`,
    );
  }
};
harden(tokenMovementAndStrideLSDFlow);

const deriveAddress = (sender, hrp) => {
  const { bytes } = decodeBech32(sender);
  const derivedAddress = encodeBech32(hrp, bytes);
  return harden(derivedAddress);
};
harden(deriveAddress);

/**
 * @param {OrchestrationAccount<any>} account
 * @param {CosmosChainAddress} address
 * @param {string} denom
 * @param {bigint} amount
 * @param {string} traceMessage
 */
const handleTransferFailure = async (
  account,
  address,
  denom,
  amount,
  traceMessage,
) => {
  trace(traceMessage);

  // https://github.com/Agoric/agoric-sdk/wiki/No-Nested-Await
  await null;

  try {
    await account.send(address, { denom, value: amount });
    trace(
      `Sent tokens to ${address.value}, denom: ${denom}, amount: ${amount}`,
    );
  } catch (error) {
    trace(
      `Failed to send tokens to ${address.value}, denom: ${denom}, amount: ${amount}`,
      error,
    );
  }
};
harden(handleTransferFailure);
/**
 * @param {OrchestrationAccount<{ chainId: string }>} localAccount
 * @param {CosmosChainAddress} hostICAAccountAddress
 * @param {string} ibcDenomOnAgoric
 * @param {bigint} amount
 */
const moveToHostChain = async (
  localAccount,
  hostICAAccountAddress,
  ibcDenomOnAgoric,
  amount,
) => {
  trace('Moving funds to host-chain');
  trace('hostICAAddress ', hostICAAccountAddress);
  trace('ibcDenomOnAgoric ', ibcDenomOnAgoric);
  trace('amount', amount);

  await localAccount.transfer(hostICAAccountAddress, {
    denom: ibcDenomOnAgoric,
    value: amount,
  });
  trace('funds moved to host-chain, ', hostICAAccountAddress.chainId);
};
harden(moveToHostChain);
/**
 * @param {OrchestrationAccount<{ chainId: string }>} strideICAAccount
 * @param {CosmosChainAddress} strideICAAddress
 * @param {bigint} amount
 * @param {string} denom
 * @returns {Promise<MsgLiquidStakeResponse>}
 */
const liquidStakeOnStride = async (
  strideICAAccount,
  strideICAAddress,
  amount,
  denom,
) => {
  // amount = 1000n;
  // denom = 'utia';

  trace('Calling liquid stake with parameters:');
  trace(
    '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++strideICAAddress: ',
    strideICAAddress.value,
  );
  trace('amount: ', amount.toString());
  trace('denom: ', denom);

  const strideLiquidStakeMsg = Any.toJSON(
    MsgLiquidStake.toProtoMsg({
      staker: strideICAAddress.value,
      nativeAmount: amount.toString(),
      // hostDenom: denom,
    }),
  );

  trace('Calling liquid stake');

  /** Last error, if we run out of retries */
  let lastErr;

  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      trace(`Liquid-stake attempt ${attempt}/20`);
      const resp = await strideICAAccount.executeEncodedTx([
        strideLiquidStakeMsg,
      ]);
      trace('Liquid stake response: ', resp);
      return harden(
        tryDecodeResponse(resp, MsgLiquidStakeResponse.fromProtoMsg),
      );
    } catch (err) {
      trace(`Attempt ${attempt} failed:`, err);
      lastErr = err;
    }
  }
  // All retries exhausted
  throw Fail`Liquid stake failed after 200 attempts: ${lastErr}`;

  const stakingResponse = await strideICAAccount.executeEncodedTx([
    strideLiquidStakeMsg,
  ]);
  return harden(
    tryDecodeResponse(stakingResponse, MsgLiquidStakeResponse.fromProtoMsg),
  );
};
harden(liquidStakeOnStride);

/**
 * @param {OrchestrationAccount<{ chainId: string }>} strideICAAccount
 * @param {CosmosChainAddress} senderElysChainAddress
 * @param {Coin} stToken
 */
const moveStTokensToElys = async (
  strideICAAccount,
  senderElysChainAddress,
  stToken,
) => {
  trace('Moving stTokens to elys from stride');
  await strideICAAccount.transfer(senderElysChainAddress, {
    denom: stToken.denom,
    value: BigInt(stToken.amount),
  });
};
harden(moveStTokensToElys);

/**
 * @param {OrchestrationAccount<{ chainId: string }>} strideICAAccount
 * @param {CosmosChainAddress} strideICAAddress
 * @param {string} amount
 * @param {string} hostZone
 * @param {string} receiver
 * @returns {Promise<void>}
 */
const redeemOnStride = async (
  strideICAAccount,
  strideICAAddress,
  amount,
  hostZone,
  receiver,
) => {
  trace('Redeeming stake on stride');
  trace('strideICAAddress: ', strideICAAddress.value);
  trace('amount: ', amount);
  trace('hostZone: ', hostZone);
  trace('receiver: ', receiver);

  const strideRedeemStakeMsg = Any.toJSON(
    MsgRedeemStake.toProtoMsg({
      redeemer: strideICAAddress.value,
      stTokenAmount: amount,
      // hostZone,
      receiver,
    }),
  );

  // https://github.com/Agoric/agoric-sdk/wiki/No-Nested-Await
  await null;

  const redeemResponse = await strideICAAccount.executeEncodedTx([strideRedeemStakeMsg]);
  trace(`Redeem stake on stride executed successfully ${redeemResponse}`);
};
harden(redeemOnStride);

/**
 * @param {OrchestrationAccount<any>} account
 * @param {FeeConfigShape} feeConfig
 * @param {bigint} amount
 * @param {string} denom
 * @param {boolean} onBoard
 * @returns {Promise<bigint>}
 */
const deductedFeeAmount = async (
  account,
  feeConfig,
  amount,
  denom,
  onBoard,
) => {
  let feeAmount;
  if (onBoard) {
    feeAmount =
      (amount * feeConfig.onBoardRate.nominator) /
      feeConfig.onBoardRate.denominator;
  } else {
    feeAmount =
      (amount * feeConfig.offBoardRate.nominator) /
      feeConfig.offBoardRate.denominator;
  }

  const finalAmount = amount - feeAmount;
  if (finalAmount < 0) {
    throw Fail`Fee is more than the amount`;
  }

  const feeReceiverChainAddress = {
    chainId: account.getAddress().chainId,
    encoding: account.getAddress().encoding,
    value: convertToBech32Address(feeConfig.feeCollector),
  };

  trace(`sending fee amount ${feeAmount} to ${feeConfig.feeCollector}`);
  await account.send(feeReceiverChainAddress, {
    denom,
    value: feeAmount,
  });
  trace('fee sent to fee collector');
  return harden(finalAmount);
};

/**
 * Splits a string into two halves at the first occurrence of '1'.
 *
 * @param {string} input
 * @returns {Bech32Address}
 */
const convertToBech32Address = input => {
  const index = input.indexOf('1');
  return `${input.slice(0, index)}1${input.slice(index + 1)}`;
};
harden(convertToBech32Address);
