import { createHash, createHmac, timingSafeEqual } from 'crypto';

import { isNonEmptyString } from '@sniptt/guards';
import { type ServerRouteRequestAuthentication } from 'twenty-shared/application';
import { assertUnreachable, isDefined } from 'twenty-shared/utils';

export type ServerRouteRequestAuthenticationResult =
  | { isAuthenticated: true }
  | { isAuthenticated: false; reason: string };

// Hashing both sides first keeps the comparison constant time even when the
// lengths differ, so a token's length never leaks through response timing.
const isTimingSafeEqual = (expected: Buffer, provided: Buffer): boolean =>
  timingSafeEqual(
    createHash('sha256').update(expected).digest(),
    createHash('sha256').update(provided).digest(),
  );

const getHeader = (
  headers: Record<string, string | string[] | undefined>,
  headerName: string,
): string | undefined => {
  const value = headers[headerName.toLowerCase()];

  return Array.isArray(value) ? value[0] : value;
};

const stripPrefix = (value: string, prefix: string | undefined): string =>
  isDefined(prefix) && value.startsWith(prefix)
    ? value.slice(prefix.length)
    : value;

export const verifyServerRouteRequestAuthentication = ({
  authentication,
  secret,
  headers,
  query,
  rawBody,
}: {
  authentication: ServerRouteRequestAuthentication;
  secret: string | undefined;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, unknown>;
  rawBody: Buffer | undefined;
}): ServerRouteRequestAuthenticationResult => {
  // Fail closed: a missing secret must not turn into an open webhook.
  if (!isNonEmptyString(secret)) {
    return {
      isAuthenticated: false,
      reason: `Server variable ${authentication.secretServerVariableName} is not set`,
    };
  }

  switch (authentication.type) {
    case 'HMAC_SIGNATURE': {
      const providedSignature = getHeader(headers, authentication.headerName);

      if (!isNonEmptyString(providedSignature)) {
        return {
          isAuthenticated: false,
          reason: `Missing ${authentication.headerName} header`,
        };
      }

      if (!isDefined(rawBody)) {
        return {
          isAuthenticated: false,
          reason:
            'Raw request body is not available for signature verification',
        };
      }

      const expectedDigest = createHmac(
        authentication.algorithm ?? 'sha256',
        secret,
      )
        .update(rawBody)
        .digest();
      const providedDigest = Buffer.from(
        stripPrefix(providedSignature.trim(), authentication.signaturePrefix),
        authentication.encoding ?? 'hex',
      );

      return providedDigest.length > 0 &&
        isTimingSafeEqual(expectedDigest, providedDigest)
        ? { isAuthenticated: true }
        : { isAuthenticated: false, reason: 'Signature mismatch' };
    }
    case 'HEADER_TOKEN': {
      const providedToken = getHeader(headers, authentication.headerName);

      if (!isNonEmptyString(providedToken)) {
        return {
          isAuthenticated: false,
          reason: `Missing ${authentication.headerName} header`,
        };
      }

      return isTimingSafeEqual(
        Buffer.from(secret, 'utf8'),
        Buffer.from(
          stripPrefix(providedToken.trim(), authentication.tokenPrefix),
          'utf8',
        ),
      )
        ? { isAuthenticated: true }
        : { isAuthenticated: false, reason: 'Token mismatch' };
    }
    case 'QUERY_TOKEN': {
      const providedToken = query[authentication.parameterName];

      if (!isNonEmptyString(providedToken)) {
        return {
          isAuthenticated: false,
          reason: `Missing ${authentication.parameterName} query parameter`,
        };
      }

      return isTimingSafeEqual(
        Buffer.from(secret, 'utf8'),
        Buffer.from(providedToken, 'utf8'),
      )
        ? { isAuthenticated: true }
        : { isAuthenticated: false, reason: 'Token mismatch' };
    }
    default:
      return assertUnreachable(authentication);
  }
};
