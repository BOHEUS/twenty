import { timingSafeEqual } from 'node:crypto';

// Length is not secret for a digest, so a length mismatch may return early.
export const isTimingSafeEqual = (
  expected: Buffer | string,
  provided: Buffer | string,
): boolean => {
  const expectedBuffer = Buffer.isBuffer(expected)
    ? expected
    : Buffer.from(expected, 'utf8');
  const providedBuffer = Buffer.isBuffer(provided)
    ? provided
    : Buffer.from(provided, 'utf8');

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
};
