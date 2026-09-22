import { createHmac } from 'crypto';

import { describe, expect, it } from 'vitest';

import { verifyWebhookSignature } from 'src/logic-functions/shared/verify-webhook-signature';

const API_KEY = 'secret-key';
const RAW_BODY = '{"id":"2db5ea61-1752-42cf-8ea1-ab1da060cd0a"}';
const validSignature = createHmac('sha1', API_KEY)
  .update(RAW_BODY, 'utf8')
  .digest('hex');

describe('verifyWebhookSignature', () => {
  it('should accept the hex HMAC-SHA1 of the raw body', () => {
    expect(
      verifyWebhookSignature({
        rawBody: RAW_BODY,
        signatureHeader: validSignature,
        apiKey: API_KEY,
      }),
    ).toEqual({ valid: true });
  });

  it('should accept an uppercased signature', () => {
    expect(
      verifyWebhookSignature({
        rawBody: RAW_BODY,
        signatureHeader: validSignature.toUpperCase(),
        apiKey: API_KEY,
      }).valid,
    ).toBe(true);
  });

  it('should reject a missing signature', () => {
    expect(
      verifyWebhookSignature({
        rawBody: RAW_BODY,
        signatureHeader: undefined,
        apiKey: API_KEY,
      }).valid,
    ).toBe(false);
  });

  it('should reject a body that was tampered with', () => {
    expect(
      verifyWebhookSignature({
        rawBody: `${RAW_BODY} `,
        signatureHeader: validSignature,
        apiKey: API_KEY,
      }).valid,
    ).toBe(false);
  });

  it('should reject a signature made with another key', () => {
    expect(
      verifyWebhookSignature({
        rawBody: RAW_BODY,
        signatureHeader: createHmac('sha1', 'other-key')
          .update(RAW_BODY, 'utf8')
          .digest('hex'),
        apiKey: API_KEY,
      }).valid,
    ).toBe(false);
  });
});
