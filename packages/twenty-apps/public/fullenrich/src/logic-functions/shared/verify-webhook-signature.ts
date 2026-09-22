import { createHmac, timingSafeEqual } from 'crypto';

import { isNonEmptyString } from '@sniptt/guards';

export const verifyWebhookSignature = ({
  rawBody,
  signatureHeader,
  apiKey,
}: {
  rawBody: string;
  signatureHeader: string | undefined;
  apiKey: string;
}): { valid: true } | { valid: false; error: string } => {
  if (!isNonEmptyString(signatureHeader)) {
    return { valid: false, error: 'Missing x-signature-sha1 header' };
  }

  const expected = createHmac('sha1', apiKey)
    .update(rawBody, 'utf8')
    .digest('hex');
  const provided = signatureHeader.trim().toLowerCase();

  if (provided.length !== expected.length) {
    return { valid: false, error: 'Signature length mismatch' };
  }

  if (
    !timingSafeEqual(Buffer.from(provided, 'utf8'), Buffer.from(expected, 'utf8'))
  ) {
    return { valid: false, error: 'Signature verification failed' };
  }

  return { valid: true };
};
