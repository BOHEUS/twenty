import { createHmac } from 'node:crypto';

import { isTimingSafeEqual } from '@/sdk/logic-function/webhooks/is-timing-safe-equal';

export type HmacSignatureAlgorithm = 'sha1' | 'sha256' | 'sha512';
export type HmacSignatureEncoding = 'hex' | 'base64';

export type VerifyHmacSignatureInput = {
  payload: string | Buffer;
  secret: string | Buffer;
  signature: string | null | undefined;
  algorithm?: HmacSignatureAlgorithm;
  encoding?: HmacSignatureEncoding;
  signaturePrefix?: string;
};

// Compares decoded digests so hex casing and base64 padding differences do
// not cause a legitimate signature to be rejected.
export const verifyHmacSignature = ({
  payload,
  secret,
  signature,
  algorithm = 'sha256',
  encoding = 'hex',
  signaturePrefix,
}: VerifyHmacSignatureInput): boolean => {
  // An empty key still yields a well-formed HMAC, so a misconfigured
  // `secret ?? ''` would otherwise accept attacker-signed payloads.
  if (secret.length === 0) {
    return false;
  }

  if (typeof signature !== 'string' || signature.trim() === '') {
    return false;
  }

  const trimmedSignature = signature.trim();
  const providedSignature =
    signaturePrefix !== undefined &&
    trimmedSignature.startsWith(signaturePrefix)
      ? trimmedSignature.slice(signaturePrefix.length)
      : trimmedSignature;

  const expectedDigest = createHmac(algorithm, secret).update(payload).digest();
  const providedDigest = Buffer.from(providedSignature, encoding);

  if (providedDigest.length === 0) {
    return false;
  }

  return isTimingSafeEqual(expectedDigest, providedDigest);
};
