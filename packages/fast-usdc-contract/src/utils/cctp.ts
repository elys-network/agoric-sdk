import type { AccountId, ChainHub } from '@agoric/orchestration';
import { parseAccountId } from '@agoric/orchestration/src/utils/address.js';

export const makeSupportsCctp = (chainHub: ChainHub) => (dest: AccountId) => {
  const { namespace, reference } = parseAccountId(dest);
  if (namespace !== 'eip155') return false;
  try {
    const ci = chainHub.getChainInfoByChainId(`${namespace}:${reference}`);
    return typeof ci.cctpDestinationDomain === 'number';
  } catch (e) {
    return false;
  }
};
