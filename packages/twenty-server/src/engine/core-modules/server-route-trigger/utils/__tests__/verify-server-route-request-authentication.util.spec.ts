import { createHmac } from 'crypto';

import { verifyServerRouteRequestAuthentication } from 'src/engine/core-modules/server-route-trigger/utils/verify-server-route-request-authentication.util';

const SECRET = 'provider-secret';
const RAW_BODY = Buffer.from('{"event":"call.ended"}');

describe('verifyServerRouteRequestAuthentication', () => {
  describe('HMAC_SIGNATURE', () => {
    const authentication = {
      type: 'HMAC_SIGNATURE' as const,
      headerName: 'X-Signature',
      secretServerVariableName: 'PROVIDER_SECRET',
      signaturePrefix: 'sha256=',
    };

    it('accepts a matching signature over the raw body', () => {
      const signature = createHmac('sha256', SECRET)
        .update(RAW_BODY)
        .digest('hex');

      expect(
        verifyServerRouteRequestAuthentication({
          authentication,
          secret: SECRET,
          headers: { 'x-signature': `sha256=${signature}` },
          query: {},
          rawBody: RAW_BODY,
        }),
      ).toEqual({ isAuthenticated: true });
    });

    it('supports sha1 base64 digests', () => {
      const signature = createHmac('sha1', SECRET)
        .update(RAW_BODY)
        .digest('base64');

      expect(
        verifyServerRouteRequestAuthentication({
          authentication: {
            ...authentication,
            algorithm: 'sha1',
            encoding: 'base64',
            signaturePrefix: undefined,
          },
          secret: SECRET,
          headers: { 'x-signature': signature },
          query: {},
          rawBody: RAW_BODY,
        }),
      ).toEqual({ isAuthenticated: true });
    });

    it('rejects a signature over a different body', () => {
      const signature = createHmac('sha256', SECRET)
        .update(Buffer.concat([RAW_BODY, Buffer.from(' ')]))
        .digest('hex');

      expect(
        verifyServerRouteRequestAuthentication({
          authentication,
          secret: SECRET,
          headers: { 'x-signature': `sha256=${signature}` },
          query: {},
          rawBody: RAW_BODY,
        }),
      ).toEqual({ isAuthenticated: false, reason: 'Signature mismatch' });
    });

    it('rejects a missing header', () => {
      expect(
        verifyServerRouteRequestAuthentication({
          authentication,
          secret: SECRET,
          headers: {},
          query: {},
          rawBody: RAW_BODY,
        }),
      ).toEqual({
        isAuthenticated: false,
        reason: 'Missing X-Signature header',
      });
    });

    it('accepts a signature over an empty body', () => {
      const signature = createHmac('sha256', SECRET)
        .update(Buffer.alloc(0))
        .digest('hex');

      expect(
        verifyServerRouteRequestAuthentication({
          authentication,
          secret: SECRET,
          headers: { 'x-signature': `sha256=${signature}` },
          query: {},
          rawBody: Buffer.alloc(0),
        }),
      ).toEqual({ isAuthenticated: true });
    });

    it('rejects when the raw body is unavailable', () => {
      expect(
        verifyServerRouteRequestAuthentication({
          authentication,
          secret: SECRET,
          headers: { 'x-signature': 'sha256=abcd' },
          query: {},
          rawBody: undefined,
        }).isAuthenticated,
      ).toBe(false);
    });
  });

  describe('HEADER_TOKEN', () => {
    const authentication = {
      type: 'HEADER_TOKEN' as const,
      headerName: 'Authorization',
      secretServerVariableName: 'PROVIDER_TOKEN',
      tokenPrefix: 'Bearer ',
    };

    it('accepts the token behind its prefix', () => {
      expect(
        verifyServerRouteRequestAuthentication({
          authentication,
          secret: SECRET,
          headers: { authorization: `Bearer ${SECRET}` },
          query: {},
          rawBody: RAW_BODY,
        }),
      ).toEqual({ isAuthenticated: true });
    });

    it('rejects another token, including one of the same length', () => {
      expect(
        verifyServerRouteRequestAuthentication({
          authentication,
          secret: SECRET,
          headers: { authorization: 'Bearer provider-secreT' },
          query: {},
          rawBody: RAW_BODY,
        }),
      ).toEqual({ isAuthenticated: false, reason: 'Token mismatch' });
    });
  });

  describe('QUERY_TOKEN', () => {
    const authentication = {
      type: 'QUERY_TOKEN' as const,
      parameterName: 'token',
      secretServerVariableName: 'PROVIDER_TOKEN',
    };

    it('accepts a matching query token', () => {
      expect(
        verifyServerRouteRequestAuthentication({
          authentication,
          secret: SECRET,
          headers: {},
          query: { token: SECRET },
          rawBody: undefined,
        }),
      ).toEqual({ isAuthenticated: true });
    });

    it('rejects a missing query token', () => {
      expect(
        verifyServerRouteRequestAuthentication({
          authentication,
          secret: SECRET,
          headers: {},
          query: {},
          rawBody: undefined,
        }),
      ).toEqual({
        isAuthenticated: false,
        reason: 'Missing token query parameter',
      });
    });
  });

  it('fails closed when the server variable is not set', () => {
    expect(
      verifyServerRouteRequestAuthentication({
        authentication: {
          type: 'QUERY_TOKEN',
          parameterName: 'token',
          secretServerVariableName: 'PROVIDER_TOKEN',
        },
        secret: undefined,
        headers: {},
        query: { token: 'anything' },
        rawBody: undefined,
      }),
    ).toEqual({
      isAuthenticated: false,
      reason: 'Server variable PROVIDER_TOKEN is not set',
    });
  });
});
