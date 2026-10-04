import { createHmac } from 'node:crypto';

import { verifyHmacSignature } from '@/sdk/logic-function/webhooks/verify-hmac-signature';

const SECRET = 'whsec_test_secret';
const PAYLOAD = '{"event":"call.ended","id":42}';

const sign = (
  algorithm: 'sha1' | 'sha256' | 'sha512',
  encoding: 'hex' | 'base64',
  payload: string = PAYLOAD,
) => createHmac(algorithm, SECRET).update(payload).digest(encoding);

describe('verifyHmacSignature', () => {
  it('accepts a hex sha256 signature by default', () => {
    expect(
      verifyHmacSignature({
        payload: PAYLOAD,
        secret: SECRET,
        signature: sign('sha256', 'hex'),
      }),
    ).toBe(true);
  });

  it('accepts uppercase hex', () => {
    expect(
      verifyHmacSignature({
        payload: PAYLOAD,
        secret: SECRET,
        signature: sign('sha256', 'hex').toUpperCase(),
      }),
    ).toBe(true);
  });

  it('accepts a base64 sha1 signature, as Twilio sends', () => {
    expect(
      verifyHmacSignature({
        payload: 'https://example.com/webhooks/server/abc?x=1CallSidCA123',
        secret: SECRET,
        signature: createHmac('sha1', SECRET)
          .update('https://example.com/webhooks/server/abc?x=1CallSidCA123')
          .digest('base64'),
        algorithm: 'sha1',
        encoding: 'base64',
      }),
    ).toBe(true);
  });

  it('accepts a sha512 signature', () => {
    expect(
      verifyHmacSignature({
        payload: PAYLOAD,
        secret: SECRET,
        signature: sign('sha512', 'hex'),
        algorithm: 'sha512',
      }),
    ).toBe(true);
  });

  it('strips a declared prefix such as sha256=', () => {
    expect(
      verifyHmacSignature({
        payload: PAYLOAD,
        secret: SECRET,
        signature: `sha256=${sign('sha256', 'hex')}`,
        signaturePrefix: 'sha256=',
      }),
    ).toBe(true);
  });

  it('rejects a signature over a different payload', () => {
    expect(
      verifyHmacSignature({
        payload: PAYLOAD,
        secret: SECRET,
        signature: sign('sha256', 'hex', PAYLOAD + ' '),
      }),
    ).toBe(false);
  });

  it('rejects a signature made with another secret', () => {
    expect(
      verifyHmacSignature({
        payload: PAYLOAD,
        secret: 'other',
        signature: sign('sha256', 'hex'),
      }),
    ).toBe(false);
  });

  it('rejects an empty secret even when the signature matches it', () => {
    const signatureWithEmptyKey = createHmac('sha256', '')
      .update(PAYLOAD)
      .digest('hex');

    expect(
      verifyHmacSignature({
        payload: PAYLOAD,
        secret: '',
        signature: signatureWithEmptyKey,
      }),
    ).toBe(false);
    expect(
      verifyHmacSignature({
        payload: PAYLOAD,
        secret: Buffer.alloc(0),
        signature: signatureWithEmptyKey,
      }),
    ).toBe(false);
  });

  it('rejects a signature made with another algorithm', () => {
    expect(
      verifyHmacSignature({
        payload: PAYLOAD,
        secret: SECRET,
        signature: sign('sha1', 'hex'),
      }),
    ).toBe(false);
  });

  it.each([null, undefined, '', '   ', 'not-hex', 'sha256='])(
    'rejects an unusable signature %p',
    (signature) => {
      expect(
        verifyHmacSignature({
          payload: PAYLOAD,
          secret: SECRET,
          signature,
          signaturePrefix: 'sha256=',
        }),
      ).toBe(false);
    },
  );
});
