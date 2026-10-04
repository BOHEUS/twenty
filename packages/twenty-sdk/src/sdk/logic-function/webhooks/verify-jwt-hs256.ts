import { createHmac } from 'node:crypto';

import { isObject } from '@sniptt/guards';

import { isTimingSafeEqual } from '@/sdk/logic-function/webhooks/is-timing-safe-equal';

export type VerifyJwtHs256Input = {
  token: string | null | undefined;
  secret: string | Buffer;
  now?: Date;
  clockToleranceSeconds?: number;
};

export type VerifyJwtHs256Result =
  | { valid: true; payload: Record<string, unknown> }
  | { valid: false; error: string };

const DEFAULT_CLOCK_TOLERANCE_SECONDS = 60;

const decodeBase64UrlJson = (
  segment: string,
): Record<string, unknown> | null => {
  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(segment, 'base64url').toString('utf8'),
    );

    return isObject(parsed) ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
};

const isValidNumericDate = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

// Providers such as Dialpad deliver the whole webhook body as an HS256 JWT.
// Only HS256 is accepted: a token that names another algorithm, including
// "none", is rejected before any signature work.
export const verifyJwtHs256 = ({
  token,
  secret,
  now = new Date(),
  clockToleranceSeconds = DEFAULT_CLOCK_TOLERANCE_SECONDS,
}: VerifyJwtHs256Input): VerifyJwtHs256Result => {
  if (secret.length === 0) {
    return { valid: false, error: 'Missing secret' };
  }

  if (Number.isNaN(now.getTime())) {
    return { valid: false, error: 'Invalid verification time' };
  }

  if (typeof token !== 'string' || token.trim() === '') {
    return { valid: false, error: 'Missing token' };
  }

  const segments = token.trim().split('.');

  if (segments.length !== 3) {
    return { valid: false, error: 'Token must have three segments' };
  }

  const [encodedHeader, encodedPayload, encodedSignature] = segments;

  const header = decodeBase64UrlJson(encodedHeader);

  if (header === null) {
    return { valid: false, error: 'Token header is not valid JSON' };
  }

  if (header.alg !== 'HS256') {
    return { valid: false, error: 'Token algorithm must be HS256' };
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest();
  const providedSignature = Buffer.from(encodedSignature, 'base64url');

  if (
    providedSignature.length === 0 ||
    !isTimingSafeEqual(expectedSignature, providedSignature)
  ) {
    return { valid: false, error: 'Signature verification failed' };
  }

  const payload = decodeBase64UrlJson(encodedPayload);

  if (payload === null) {
    return { valid: false, error: 'Token payload is not valid JSON' };
  }

  const nowSeconds = Math.floor(now.getTime() / 1000);

  if (
    isValidNumericDate(payload.exp) &&
    nowSeconds > payload.exp + clockToleranceSeconds
  ) {
    return { valid: false, error: 'Token has expired' };
  }

  if (
    isValidNumericDate(payload.nbf) &&
    nowSeconds < payload.nbf - clockToleranceSeconds
  ) {
    return { valid: false, error: 'Token is not valid yet' };
  }

  return { valid: true, payload };
};
