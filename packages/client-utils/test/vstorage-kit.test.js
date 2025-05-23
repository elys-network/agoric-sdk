/* eslint-env node */
import test from 'ava';
import { encodeBase64 } from '@endo/base64';
import { makeAgoricNames, makeVstorageKit } from '../src/vstorage-kit.js';
import { makeAbciQuery } from '../src/vstorage.js';

const makeDefaultMockResponse = () => {
  const jsonString = JSON.stringify({ value: '{"blockHeight":1,"values":[]}' });
  const buf = new TextEncoder().encode(jsonString);
  const b64Value = encodeBase64(buf);
  return {
    result: {
      response: {
        code: 0,
        value: b64Value,
      },
    },
  };
};

const makeMockFetch = (responses = {}) => {
  const defaultMockResponse = makeDefaultMockResponse();
  return async url => {
    const response = responses[url] || defaultMockResponse;
    return { json: () => Promise.resolve(response) };
  };
};

const makeTestConfig = () => ({
  chainName: 'test-chain',
  rpcAddrs: ['http://localhost:26657'],
});

test('agoricNames contains expected structure', async t => {
  /** @type {typeof window.fetch} */
  let mockFetch;

  const vstorageKit = makeVstorageKit(
    { fetch: (...args) => mockFetch(...args) },
    makeTestConfig(),
  );

  // @ts-expect-error mock
  mockFetch = makeMockFetch({
    [`http://localhost:26657${makeAbciQuery('published.agoricNames.brand', { kind: 'data' })}`]:
      {
        result: {
          response: {
            code: 0,
            value:
              // observed in a3p
              'CvEHeyJibG9ja0hlaWdodCI6Ijc2OSIsInZhbHVlcyI6WyJ7XCJib2R5XCI6XCIjW1tcXFwiQVRPTVxcXCIsXFxcIiQwLkFsbGVnZWQ6IEFUT00gYnJhbmRcXFwiXSxbXFxcIkJMRFxcXCIsXFxcIiQxLkFsbGVnZWQ6IEJMRCBicmFuZFxcXCJdLFtcXFwiREFJX2F4bFxcXCIsXFxcIiQyLkFsbGVnZWQ6IERBSV9heGwgYnJhbmRcXFwiXSxbXFxcIkRBSV9ncnZcXFwiLFxcXCIkMy5BbGxlZ2VkOiBEQUlfZ3J2IGJyYW5kXFxcIl0sW1xcXCJJU1RcXFwiLFxcXCIkNC5BbGxlZ2VkOiBJU1QgYnJhbmRcXFwiXSxbXFxcIkludml0YXRpb25cXFwiLFxcXCIkNS5BbGxlZ2VkOiBab2UgSW52aXRhdGlvbiBicmFuZFxcXCJdLFtcXFwiS1JFQWRDSEFSQUNURVJcXFwiLFxcXCIkNi5BbGxlZ2VkOiBLUkVBZENIQVJBQ1RFUiBicmFuZFxcXCJdLFtcXFwiS1JFQWRJVEVNXFxcIixcXFwiJDcuQWxsZWdlZDogS1JFQWRJVEVNIGJyYW5kXFxcIl0sW1xcXCJVU0RDX2F4bFxcXCIsXFxcIiQ4LkFsbGVnZWQ6IFVTRENfYXhsIGJyYW5kXFxcIl0sW1xcXCJVU0RDX2dydlxcXCIsXFxcIiQ5LkFsbGVnZWQ6IFVTRENfZ3J2IGJyYW5kXFxcIl0sW1xcXCJVU0RUX2F4bFxcXCIsXFxcIiQxMC5BbGxlZ2VkOiBVU0RUX2F4bCBicmFuZFxcXCJdLFtcXFwiVVNEVF9ncnZcXFwiLFxcXCIkMTEuQWxsZWdlZDogVVNEVF9ncnYgYnJhbmRcXFwiXSxbXFxcInRpbWVyXFxcIixcXFwiJDEyLkFsbGVnZWQ6IHRpbWVyQnJhbmRcXFwiXSxbXFxcInN0QVRPTVxcXCIsXFxcIiQxMy5BbGxlZ2VkOiBzdEFUT00gYnJhbmRcXFwiXV1cIixcInNsb3RzXCI6W1wiYm9hcmQwNTU1N1wiLFwiYm9hcmQwNTY2XCIsXCJib2FyZDA1NzM2XCIsXCJib2FyZDAzMTM4XCIsXCJib2FyZDAyNTdcIixcImJvYXJkMDA3NFwiLFwiYm9hcmQwMzI4MVwiLFwiYm9hcmQwMDI4MlwiLFwiYm9hcmQwMzA0MFwiLFwiYm9hcmQwNDU0MlwiLFwiYm9hcmQwMTc0NFwiLFwiYm9hcmQwMzQ0NlwiLFwiYm9hcmQwNDI1XCIsXCJib2FyZDAwOTkwXCJdfSJdfQ==',
          },
        },
      },
    [`http://localhost:26657${makeAbciQuery('published.agoricNames.instance', { kind: 'data' })}`]:
      {
        result: {
          response: {
            code: 0,
            value:
              // observed in a3p
              'CrkteyJibG9ja0hlaWdodCI6IjExNDEiLCJ2YWx1ZXMiOlsie1wiYm9keVwiOlwiI1tbXFxcIkFUT00tVVNEIHByaWNlIGZlZWRcXFwiLFxcXCIkMC5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwiQ3JhYmJsZVxcXCIsXFxcIiQxLkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJDcmFiYmxlQ29tbWl0dGVlXFxcIixcXFwiJDIuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcIkNyYWJibGVHb3Zlcm5vclxcXCIsXFxcIiQzLkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJWYXVsdEZhY3RvcnlcXFwiLFxcXCIkNC5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwiVmF1bHRGYWN0b3J5R292ZXJub3JcXFwiLFxcXCIkNS5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwiZWNvbkNvbW1pdHRlZUNoYXJ0ZXJcXFwiLFxcXCIkNi5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwiZWNvbm9taWNDb21taXR0ZWVcXFwiLFxcXCIkNy5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwiZmVlRGlzdHJpYnV0b3JcXFwiLFxcXCIkOC5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwia3JlYWRcXFwiLFxcXCIkOS5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwia3JlYWRDb21taXR0ZWVcXFwiLFxcXCIkMTAuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcImtyZWFkQ29tbWl0dGVlQ2hhcnRlclxcXCIsXFxcIiQxMS5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwicHJvdmlzaW9uUG9vbFxcXCIsXFxcIiQxMi5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwicHNtLUlTVC1EQUlfYXhsXFxcIixcXFwiJDEzLkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJwc20tSVNULURBSV9ncnZcXFwiLFxcXCIkMTQuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcInBzbS1JU1QtVVNEQ19heGxcXFwiLFxcXCIkMTUuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcInBzbS1JU1QtVVNEQ19ncnZcXFwiLFxcXCIkMTYuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcInBzbS1JU1QtVVNEVF9heGxcXFwiLFxcXCIkMTcuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcInBzbS1JU1QtVVNEVF9ncnZcXFwiLFxcXCIkMTguQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcInJlc2VydmVcXFwiLFxcXCIkMTkuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcInJlc2VydmVHb3Zlcm5vclxcXCIsXFxcIiQyMC5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwic2NhbGVkUHJpY2VBdXRob3JpdHktc3RBVE9NXFxcIixcXFwiJDIxLkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJzdEFUT00tVVNEIHByaWNlIGZlZWRcXFwiLFxcXCIkMjIuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcIndhbGxldEZhY3RvcnlcXFwiLFxcXCIkMjMuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXV1cIixcInNsb3RzXCI6W1wiYm9hcmQwMjk2M1wiLFwiYm9hcmQwNDM5NVwiLFwiYm9hcmQwMjM5M1wiLFwiYm9hcmQwNTM5NlwiLFwiYm9hcmQwMDM2MFwiLFwiYm9hcmQwMzc3M1wiLFwiYm9hcmQwNDY2MVwiLFwiYm9hcmQwNDE0OVwiLFwiYm9hcmQwNTI2MlwiLFwiYm9hcmQwNDc4M1wiLFwiYm9hcmQwMTk4NVwiLFwiYm9hcmQwNjI4NFwiLFwiYm9hcmQwMTY2NFwiLFwiYm9hcmQwMTg2N1wiLFwiYm9hcmQwMjU2OFwiLFwiYm9hcmQwNTY2OVwiLFwiYm9hcmQwNTk3MFwiLFwiYm9hcmQwMjI3MVwiLFwiYm9hcmQwMTI3MlwiLFwiYm9hcmQwNjQ1OFwiLFwiYm9hcmQwMzM2NVwiLFwiYm9hcmQwNTg5MlwiLFwiYm9hcmQwNDA5MVwiLFwiYm9hcmQwNjM2NlwiXX0iLCJ7XCJib2R5XCI6XCIjW1tcXFwiQVRPTS1VU0QgcHJpY2UgZmVlZFxcXCIsXFxcIiQwLkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJDcmFiYmxlXFxcIixcXFwiJDEuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcIkNyYWJibGVDb21taXR0ZWVcXFwiLFxcXCIkMi5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwiQ3JhYmJsZUdvdmVybm9yXFxcIixcXFwiJDMuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcIlZhdWx0RmFjdG9yeVxcXCIsXFxcIiQ0LkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJWYXVsdEZhY3RvcnlHb3Zlcm5vclxcXCIsXFxcIiQ1LkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJlY29uQ29tbWl0dGVlQ2hhcnRlclxcXCIsXFxcIiQ2LkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJlY29ub21pY0NvbW1pdHRlZVxcXCIsXFxcIiQ3LkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJmZWVEaXN0cmlidXRvclxcXCIsXFxcIiQ4LkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJrcmVhZFxcXCIsXFxcIiQ5LkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJrcmVhZENvbW1pdHRlZVxcXCIsXFxcIiQxMC5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwia3JlYWRDb21taXR0ZWVDaGFydGVyXFxcIixcXFwiJDExLkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJwcm92aXNpb25Qb29sXFxcIixcXFwiJDEyLkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJwc20tSVNULURBSV9heGxcXFwiLFxcXCIkMTMuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcInBzbS1JU1QtREFJX2dydlxcXCIsXFxcIiQxNC5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwicHNtLUlTVC1VU0RDX2F4bFxcXCIsXFxcIiQxNS5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwicHNtLUlTVC1VU0RDX2dydlxcXCIsXFxcIiQxNi5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwicHNtLUlTVC1VU0RUX2F4bFxcXCIsXFxcIiQxNy5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwicHNtLUlTVC1VU0RUX2dydlxcXCIsXFxcIiQxOC5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwicmVzZXJ2ZVxcXCIsXFxcIiQxOS5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwicmVzZXJ2ZUdvdmVybm9yXFxcIixcXFwiJDIwLkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJzY2FsZWRQcmljZUF1dGhvcml0eS1zdEFUT01cXFwiLFxcXCIkMjEuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcInN0QVRPTS1VU0QgcHJpY2UgZmVlZFxcXCIsXFxcIiQyMi5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwid2FsbGV0RmFjdG9yeVxcXCIsXFxcIiQyMy5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwiYXVjdGlvbmVlclxcXCIsXFxcIiQyNC5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdXVwiLFwic2xvdHNcIjpbXCJib2FyZDAyOTYzXCIsXCJib2FyZDA0Mzk1XCIsXCJib2FyZDAyMzkzXCIsXCJib2FyZDA1Mzk2XCIsXCJib2FyZDAwMzYwXCIsXCJib2FyZDAzNzczXCIsXCJib2FyZDA0NjYxXCIsXCJib2FyZDA0MTQ5XCIsXCJib2FyZDA1MjYyXCIsXCJib2FyZDA0NzgzXCIsXCJib2FyZDAxOTg1XCIsXCJib2FyZDA2Mjg0XCIsXCJib2FyZDAxNjY0XCIsXCJib2FyZDAxODY3XCIsXCJib2FyZDAyNTY4XCIsXCJib2FyZDA1NjY5XCIsXCJib2FyZDA1OTcwXCIsXCJib2FyZDAyMjcxXCIsXCJib2FyZDAxMjcyXCIsXCJib2FyZDA2NDU4XCIsXCJib2FyZDAzMzY1XCIsXCJib2FyZDA1ODkyXCIsXCJib2FyZDA0MDkxXCIsXCJib2FyZDA2MzY2XCIsXCJib2FyZDA2Mjk5XCJdfSIsIntcImJvZHlcIjpcIiNbW1xcXCJBVE9NLVVTRCBwcmljZSBmZWVkXFxcIixcXFwiJDAuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcIkNyYWJibGVcXFwiLFxcXCIkMS5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwiQ3JhYmJsZUNvbW1pdHRlZVxcXCIsXFxcIiQyLkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJDcmFiYmxlR292ZXJub3JcXFwiLFxcXCIkMy5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwiVmF1bHRGYWN0b3J5XFxcIixcXFwiJDQuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcIlZhdWx0RmFjdG9yeUdvdmVybm9yXFxcIixcXFwiJDUuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcImF1Y3Rpb25lZXJcXFwiLFxcXCIkNi5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwiZWNvbkNvbW1pdHRlZUNoYXJ0ZXJcXFwiLFxcXCIkNy5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwiZWNvbm9taWNDb21taXR0ZWVcXFwiLFxcXCIkOC5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwiZmVlRGlzdHJpYnV0b3JcXFwiLFxcXCIkOS5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwia3JlYWRcXFwiLFxcXCIkMTAuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcImtyZWFkQ29tbWl0dGVlXFxcIixcXFwiJDExLkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJrcmVhZENvbW1pdHRlZUNoYXJ0ZXJcXFwiLFxcXCIkMTIuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcInByb3Zpc2lvblBvb2xcXFwiLFxcXCIkMTMuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcInBzbS1JU1QtREFJX2F4bFxcXCIsXFxcIiQxNC5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwicHNtLUlTVC1EQUlfZ3J2XFxcIixcXFwiJDE1LkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJwc20tSVNULVVTRENfYXhsXFxcIixcXFwiJDE2LkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJwc20tSVNULVVTRENfZ3J2XFxcIixcXFwiJDE3LkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJwc20tSVNULVVTRFRfYXhsXFxcIixcXFwiJDE4LkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJwc20tSVNULVVTRFRfZ3J2XFxcIixcXFwiJDE5LkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJyZXNlcnZlXFxcIixcXFwiJDIwLkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJyZXNlcnZlR292ZXJub3JcXFwiLFxcXCIkMjEuQWxsZWdlZDogSW5zdGFuY2VIYW5kbGVcXFwiXSxbXFxcInNjYWxlZFByaWNlQXV0aG9yaXR5LXN0QVRPTVxcXCIsXFxcIiQyMi5BbGxlZ2VkOiBJbnN0YW5jZUhhbmRsZVxcXCJdLFtcXFwic3RBVE9NLVVTRCBwcmljZSBmZWVkXFxcIixcXFwiJDIzLkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl0sW1xcXCJ3YWxsZXRGYWN0b3J5XFxcIixcXFwiJDI0LkFsbGVnZWQ6IEluc3RhbmNlSGFuZGxlXFxcIl1dXCIsXCJzbG90c1wiOltcImJvYXJkMDI5NjNcIixcImJvYXJkMDQzOTVcIixcImJvYXJkMDIzOTNcIixcImJvYXJkMDUzOTZcIixcImJvYXJkMDAzNjBcIixcImJvYXJkMDM3NzNcIixcImJvYXJkMDYyOTlcIixcImJvYXJkMDQ2NjFcIixcImJvYXJkMDQxNDlcIixcImJvYXJkMDUyNjJcIixcImJvYXJkMDQ3ODNcIixcImJvYXJkMDE5ODVcIixcImJvYXJkMDYyODRcIixcImJvYXJkMDE2NjRcIixcImJvYXJkMDE4NjdcIixcImJvYXJkMDI1NjhcIixcImJvYXJkMDU2NjlcIixcImJvYXJkMDU5NzBcIixcImJvYXJkMDIyNzFcIixcImJvYXJkMDEyNzJcIixcImJvYXJkMDY0NThcIixcImJvYXJkMDMzNjVcIixcImJvYXJkMDU4OTJcIixcImJvYXJkMDQwOTFcIixcImJvYXJkMDYzNjZcIl19Il19',
          },
        },
      },
    [`http://localhost:26657${makeAbciQuery('published.agoricNames.vbankAsset', { kind: 'data' })}`]:
      {
        result: {
          response: {
            code: 0,
            value:
              // observed in a3p
              'CsUheyJibG9ja0hlaWdodCI6Ijc2OSIsInZhbHVlcyI6WyJ7XCJib2R5XCI6XCIjW1tcXFwiaWJjLzI5NTU0OEE3ODc4NUExMDA3RjIzMkRFMjg2MTQ5QTZGRjUxMkYxODBBRjU2NTc3ODBGQzg5QzAwOUUyQzM0OEZcXFwiLHtcXFwiYnJhbmRcXFwiOlxcXCIkMC5BbGxlZ2VkOiBVU0RDX2F4bCBicmFuZFxcXCIsXFxcImRlbm9tXFxcIjpcXFwiaWJjLzI5NTU0OEE3ODc4NUExMDA3RjIzMkRFMjg2MTQ5QTZGRjUxMkYxODBBRjU2NTc3ODBGQzg5QzAwOUUyQzM0OEZcXFwiLFxcXCJkaXNwbGF5SW5mb1xcXCI6e1xcXCJhc3NldEtpbmRcXFwiOlxcXCJuYXRcXFwiLFxcXCJkZWNpbWFsUGxhY2VzXFxcIjo2fSxcXFwiaXNzdWVyXFxcIjpcXFwiJDEuQWxsZWdlZDogVVNEQ19heGwgaXNzdWVyXFxcIixcXFwiaXNzdWVyTmFtZVxcXCI6XFxcIlVTRENfYXhsXFxcIixcXFwicHJvcG9zZWROYW1lXFxcIjpcXFwiVVNEIENvaW5cXFwifV0sW1xcXCJpYmMvMzg2RDA5QUUzMURBN0MwQzkzMDkxQkI0NUQwOENCN0EwNzMwQjFGNjk3Q0Q4MTNGMDZBNTQ0NkRDRjAyRUVCMlxcXCIse1xcXCJicmFuZFxcXCI6XFxcIiQyLkFsbGVnZWQ6IFVTRFRfZ3J2IGJyYW5kXFxcIixcXFwiZGVub21cXFwiOlxcXCJpYmMvMzg2RDA5QUUzMURBN0MwQzkzMDkxQkI0NUQwOENCN0EwNzMwQjFGNjk3Q0Q4MTNGMDZBNTQ0NkRDRjAyRUVCMlxcXCIsXFxcImRpc3BsYXlJbmZvXFxcIjp7XFxcImFzc2V0S2luZFxcXCI6XFxcIm5hdFxcXCIsXFxcImRlY2ltYWxQbGFjZXNcXFwiOjZ9LFxcXCJpc3N1ZXJcXFwiOlxcXCIkMy5BbGxlZ2VkOiBVU0RUX2dydiBpc3N1ZXJcXFwiLFxcXCJpc3N1ZXJOYW1lXFxcIjpcXFwiVVNEVF9ncnZcXFwiLFxcXCJwcm9wb3NlZE5hbWVcXFwiOlxcXCJUZXRoZXIgVVNEXFxcIn1dLFtcXFwiaWJjLzM5MTRCREVGNDZGNDI5QTI2OTE3RTREOEQ0MzQ2MjBFQzQ4MTdEQzZCNkU2OEZCMzI3RTE5MDkwMkYxRTkyNDJcXFwiLHtcXFwiYnJhbmRcXFwiOlxcXCIkNC5BbGxlZ2VkOiBEQUlfYXhsIGJyYW5kXFxcIixcXFwiZGVub21cXFwiOlxcXCJpYmMvMzkxNEJERUY0NkY0MjlBMjY5MTdFNEQ4RDQzNDYyMEVDNDgxN0RDNkI2RTY4RkIzMjdFMTkwOTAyRjFFOTI0MlxcXCIsXFxcImRpc3BsYXlJbmZvXFxcIjp7XFxcImFzc2V0S2luZFxcXCI6XFxcIm5hdFxcXCIsXFxcImRlY2ltYWxQbGFjZXNcXFwiOjE4fSxcXFwiaXNzdWVyXFxcIjpcXFwiJDUuQWxsZWdlZDogREFJX2F4bCBpc3N1ZXJcXFwiLFxcXCJpc3N1ZXJOYW1lXFxcIjpcXFwiREFJX2F4bFxcXCIsXFxcInByb3Bvc2VkTmFtZVxcXCI6XFxcIkRBSVxcXCJ9XSxbXFxcImliYy8zRDUyOTFDMjNENzc2QzNBQTdBN0FCQjM0QzdCMDIzMTkzRUNEMkJDNDJFQTE5RDMxNjVCMkNGOTY1MjExN0U3XFxcIix7XFxcImJyYW5kXFxcIjpcXFwiJDYuQWxsZWdlZDogREFJX2dydiBicmFuZFxcXCIsXFxcImRlbm9tXFxcIjpcXFwiaWJjLzNENTI5MUMyM0Q3NzZDM0FBN0E3QUJCMzRDN0IwMjMxOTNFQ0QyQkM0MkVBMTlEMzE2NUIyQ0Y5NjUyMTE3RTdcXFwiLFxcXCJkaXNwbGF5SW5mb1xcXCI6e1xcXCJhc3NldEtpbmRcXFwiOlxcXCJuYXRcXFwiLFxcXCJkZWNpbWFsUGxhY2VzXFxcIjoxOH0sXFxcImlzc3VlclxcXCI6XFxcIiQ3LkFsbGVnZWQ6IERBSV9ncnYgaXNzdWVyXFxcIixcXFwiaXNzdWVyTmFtZVxcXCI6XFxcIkRBSV9ncnZcXFwiLFxcXCJwcm9wb3NlZE5hbWVcXFwiOlxcXCJEQUlcXFwifV0sW1xcXCJpYmMvNDIyMjVGMTQ3MTM3RERFQjVGRUYwRjFEMEE5MkYyQUQ1NzU1N0FGQTJDNEQ2RjMwQjIxRTBEOTgzMDAxQzAwMlxcXCIse1xcXCJicmFuZFxcXCI6XFxcIiQ4LkFsbGVnZWQ6IHN0QVRPTSBicmFuZFxcXCIsXFxcImRlbm9tXFxcIjpcXFwiaWJjLzQyMjI1RjE0NzEzN0RERUI1RkVGMEYxRDBBOTJGMkFENTc1NTdBRkEyQzRENkYzMEIyMUUwRDk4MzAwMUMwMDJcXFwiLFxcXCJkaXNwbGF5SW5mb1xcXCI6e1xcXCJhc3NldEtpbmRcXFwiOlxcXCJuYXRcXFwiLFxcXCJkZWNpbWFsUGxhY2VzXFxcIjo2fSxcXFwiaXNzdWVyXFxcIjpcXFwiJDkuQWxsZWdlZDogc3RBVE9NIGlzc3VlclxcXCIsXFxcImlzc3Vlck5hbWVcXFwiOlxcXCJzdEFUT01cXFwiLFxcXCJwcm9wb3NlZE5hbWVcXFwiOlxcXCJzdEFUT01cXFwifV0sW1xcXCJpYmMvNjgzMTI5MjkwMzQ4N0U1OEJGOUExOTVGRERDOEEyRTYyNkIzREYzOUI4OEY0RTdGNDFDOTM1Q0FEQkFGNTRBQ1xcXCIse1xcXCJicmFuZFxcXCI6XFxcIiQxMC5BbGxlZ2VkOiBVU0RDX2dydiBicmFuZFxcXCIsXFxcImRlbm9tXFxcIjpcXFwiaWJjLzY4MzEyOTI5MDM0ODdFNThCRjlBMTk1RkREQzhBMkU2MjZCM0RGMzlCODhGNEU3RjQxQzkzNUNBREJBRjU0QUNcXFwiLFxcXCJkaXNwbGF5SW5mb1xcXCI6e1xcXCJhc3NldEtpbmRcXFwiOlxcXCJuYXRcXFwiLFxcXCJkZWNpbWFsUGxhY2VzXFxcIjo2fSxcXFwiaXNzdWVyXFxcIjpcXFwiJDExLkFsbGVnZWQ6IFVTRENfZ3J2IGlzc3VlclxcXCIsXFxcImlzc3Vlck5hbWVcXFwiOlxcXCJVU0RDX2dydlxcXCIsXFxcInByb3Bvc2VkTmFtZVxcXCI6XFxcIlVTQyBDb2luXFxcIn1dLFtcXFwiaWJjL0JBMzEzQzRBMTlERkJGOTQzNTg2QzAzODdFNkIxMTI4NkY5RTQxNkI0REQyNzU3NEU2OTA5Q0FCRTBFMzQyRkFcXFwiLHtcXFwiYnJhbmRcXFwiOlxcXCIkMTIuQWxsZWdlZDogQVRPTSBicmFuZFxcXCIsXFxcImRlbm9tXFxcIjpcXFwiaWJjL0JBMzEzQzRBMTlERkJGOTQzNTg2QzAzODdFNkIxMTI4NkY5RTQxNkI0REQyNzU3NEU2OTA5Q0FCRTBFMzQyRkFcXFwiLFxcXCJkaXNwbGF5SW5mb1xcXCI6e1xcXCJhc3NldEtpbmRcXFwiOlxcXCJuYXRcXFwiLFxcXCJkZWNpbWFsUGxhY2VzXFxcIjo2fSxcXFwiaXNzdWVyXFxcIjpcXFwiJDEzLkFsbGVnZWQ6IEFUT00gaXNzdWVyXFxcIixcXFwiaXNzdWVyTmFtZVxcXCI6XFxcIkFUT01cXFwiLFxcXCJwcm9wb3NlZE5hbWVcXFwiOlxcXCJBVE9NXFxcIn1dLFtcXFwiaWJjL0YyMzMxNjQ1Qjk2ODMxMTYxODhFRjM2RkMwNEE4MDlDMjhCRDM2QjU0NTU1RTg3MDVBMzcxNDZEMDE4MkYwNDVcXFwiLHtcXFwiYnJhbmRcXFwiOlxcXCIkMTQuQWxsZWdlZDogVVNEVF9heGwgYnJhbmRcXFwiLFxcXCJkZW5vbVxcXCI6XFxcImliYy9GMjMzMTY0NUI5NjgzMTE2MTg4RUYzNkZDMDRBODA5QzI4QkQzNkI1NDU1NUU4NzA1QTM3MTQ2RDAxODJGMDQ1XFxcIixcXFwiZGlzcGxheUluZm9cXFwiOntcXFwiYXNzZXRLaW5kXFxcIjpcXFwibmF0XFxcIixcXFwiZGVjaW1hbFBsYWNlc1xcXCI6Nn0sXFxcImlzc3VlclxcXCI6XFxcIiQxNS5BbGxlZ2VkOiBVU0RUX2F4bCBpc3N1ZXJcXFwiLFxcXCJpc3N1ZXJOYW1lXFxcIjpcXFwiVVNEVF9heGxcXFwiLFxcXCJwcm9wb3NlZE5hbWVcXFwiOlxcXCJUZXRoZXIgVVNEXFxcIn1dLFtcXFwidWJsZFxcXCIse1xcXCJicmFuZFxcXCI6XFxcIiQxNi5BbGxlZ2VkOiBCTEQgYnJhbmRcXFwiLFxcXCJkZW5vbVxcXCI6XFxcInVibGRcXFwiLFxcXCJkaXNwbGF5SW5mb1xcXCI6e1xcXCJhc3NldEtpbmRcXFwiOlxcXCJuYXRcXFwiLFxcXCJkZWNpbWFsUGxhY2VzXFxcIjo2fSxcXFwiaXNzdWVyXFxcIjpcXFwiJDE3LkFsbGVnZWQ6IEJMRCBpc3N1ZXJcXFwiLFxcXCJpc3N1ZXJOYW1lXFxcIjpcXFwiQkxEXFxcIixcXFwicHJvcG9zZWROYW1lXFxcIjpcXFwiQWdvcmljIHN0YWtpbmcgdG9rZW5cXFwifV0sW1xcXCJ1aXN0XFxcIix7XFxcImJyYW5kXFxcIjpcXFwiJDE4LkFsbGVnZWQ6IElTVCBicmFuZFxcXCIsXFxcImRlbm9tXFxcIjpcXFwidWlzdFxcXCIsXFxcImRpc3BsYXlJbmZvXFxcIjp7XFxcImFzc2V0S2luZFxcXCI6XFxcIm5hdFxcXCIsXFxcImRlY2ltYWxQbGFjZXNcXFwiOjZ9LFxcXCJpc3N1ZXJcXFwiOlxcXCIkMTkuQWxsZWdlZDogSVNUIGlzc3VlclxcXCIsXFxcImlzc3Vlck5hbWVcXFwiOlxcXCJJU1RcXFwiLFxcXCJwcm9wb3NlZE5hbWVcXFwiOlxcXCJBZ29yaWMgc3RhYmxlIHRva2VuXFxcIn1dXVwiLFwic2xvdHNcIjpbXCJib2FyZDAzMDQwXCIsXCJib2FyZDA1MTQxXCIsXCJib2FyZDAzNDQ2XCIsXCJib2FyZDAxNTQ3XCIsXCJib2FyZDA1NzM2XCIsXCJib2FyZDAyNDM3XCIsXCJib2FyZDAzMTM4XCIsXCJib2FyZDA1MDM5XCIsXCJib2FyZDAwOTkwXCIsXCJib2FyZDAwNjg5XCIsXCJib2FyZDA0NTQyXCIsXCJib2FyZDAwNDQzXCIsXCJib2FyZDA1NTU3XCIsXCJib2FyZDAyNjU2XCIsXCJib2FyZDAxNzQ0XCIsXCJib2FyZDA2NDQ1XCIsXCJib2FyZDA1NjZcIixcImJvYXJkMDU5MlwiLFwiYm9hcmQwMjU3XCIsXCJib2FyZDAyMjNcIl19Il19',
          },
        },
      },
    [`http://localhost:26657${makeAbciQuery('published.priceFeed.ATOM-USD_price_feed', { kind: 'data' })}`]:
      {
        id: 'priceFeed.ATOM-USD_price_feed',
        result: {
          response: {
            code: 0,
            value:
              // observed in a3p
              'CvYGeyJibG9ja0hlaWdodCI6IjUwOCIsInZhbHVlcyI6WyJ7XCJib2R5XCI6XCIje1xcXCJhbW91bnRJblxcXCI6e1xcXCJicmFuZFxcXCI6XFxcIiQwLkFsbGVnZWQ6IEJyYW5kXFxcIixcXFwidmFsdWVcXFwiOlxcXCIrMTAwMDAwMFxcXCJ9LFxcXCJhbW91bnRPdXRcXFwiOntcXFwiYnJhbmRcXFwiOlxcXCIkMS5BbGxlZ2VkOiBCcmFuZFxcXCIsXFxcInZhbHVlXFxcIjpcXFwiKzEyMDEwMDAwXFxcIn0sXFxcInRpbWVyXFxcIjpcXFwiJDIuQWxsZWdlZDogdGltZXJTZXJ2aWNlXFxcIixcXFwidGltZXN0YW1wXFxcIjp7XFxcImFic1ZhbHVlXFxcIjpcXFwiKzE3MjkxNzYyOTBcXFwiLFxcXCJ0aW1lckJyYW5kXFxcIjpcXFwiJDMuQWxsZWdlZDogdGltZXJCcmFuZFxcXCJ9fVwiLFwic2xvdHNcIjpbXCJib2FyZDAzOTM1XCIsXCJib2FyZDAxMDM0XCIsXCJib2FyZDA1Njc0XCIsXCJib2FyZDA0MjVcIl19Iiwie1wiYm9keVwiOlwiI3tcXFwiYW1vdW50SW5cXFwiOntcXFwiYnJhbmRcXFwiOlxcXCIkMC5BbGxlZ2VkOiBCcmFuZFxcXCIsXFxcInZhbHVlXFxcIjpcXFwiKzEwMDAwMDBcXFwifSxcXFwiYW1vdW50T3V0XFxcIjp7XFxcImJyYW5kXFxcIjpcXFwiJDEuQWxsZWdlZDogQnJhbmRcXFwiLFxcXCJ2YWx1ZVxcXCI6XFxcIisxMjAxMDAwMFxcXCJ9LFxcXCJ0aW1lclxcXCI6XFxcIiQyLkFsbGVnZWQ6IHRpbWVyU2VydmljZVxcXCIsXFxcInRpbWVzdGFtcFxcXCI6e1xcXCJhYnNWYWx1ZVxcXCI6XFxcIisxNzI5MTc2MjkwXFxcIixcXFwidGltZXJCcmFuZFxcXCI6XFxcIiQzLkFsbGVnZWQ6IHRpbWVyQnJhbmRcXFwifX1cIixcInNsb3RzXCI6W1wiYm9hcmQwMzkzNVwiLFwiYm9hcmQwMTAzNFwiLFwiYm9hcmQwNTY3NFwiLFwiYm9hcmQwNDI1XCJdfSJdfQ==',
          },
        },
      },
  });

  const agoricNames = await makeAgoricNames(
    vstorageKit.fromBoard,
    vstorageKit.vstorage,
  );

  t.snapshot(agoricNames, 'agoricNames from A3P');

  const priceFeed = await vstorageKit.readPublished(
    'priceFeed.ATOM-USD_price_feed',
  );
  t.snapshot(priceFeed, 'priceFeed from A3P');
});
