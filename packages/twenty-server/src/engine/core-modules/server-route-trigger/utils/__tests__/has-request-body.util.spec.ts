import { type Request } from 'express';

import { hasRequestBody } from 'src/engine/core-modules/server-route-trigger/utils/has-request-body.util';

const requestWithHeaders = (headers: Record<string, string>): Request =>
  ({ headers }) as unknown as Request;

describe('hasRequestBody', () => {
  it.each([
    [{ 'content-length': '12' }, true],
    [{ 'transfer-encoding': 'chunked' }, true],
    [{ 'content-length': '0' }, false],
    [{}, false],
    [{ 'content-length': 'not-a-number' }, false],
  ])('returns the right answer for %o', (headers, expected) => {
    expect(hasRequestBody(requestWithHeaders(headers))).toBe(expected);
  });
});
