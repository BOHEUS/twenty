import { isDefined } from 'twenty-sdk/utils';

import { toJsonObject } from 'src/logic-functions/data/to-json';
import { toStringArray } from 'src/logic-functions/data/to-string-array';
import { toText } from 'src/logic-functions/data/to-text';

const API_KEY_REJECTED_MESSAGE =
  'Lusha rejected the API key. Check the key in the Lusha app settings.';

const MESSAGE_BY_STATUS: Record<number, string> = {
  402: 'The Lusha account has run out of credits.',
  429: 'Lusha rate limit reached. Try again later.',
  451: 'Lusha blocked the request under GDPR.',
};

// These failures come from the API key, the account or its quota, so every
// later request of the same run would fail the same way.
const ACCOUNT_FAILURE_STATUSES = new Set([401, 402, 403, 429]);

const readLushaMessage = (payload: unknown): string | undefined => {
  const body = toJsonObject(payload);

  return toStringArray(body?.errors)?.join('; ') ?? toText(body?.message);
};

export const buildLushaError = ({
  status,
  payload,
}: {
  status: number;
  payload: unknown;
}): { message: string; isAccountFailure: boolean } => {
  const lushaMessage = readLushaMessage(payload);

  // Lusha answers a malformed key with a 400 rather than a 401.
  const isApiKeyRejected =
    status === 401 || (status === 400 && /api key/i.test(lushaMessage ?? ''));

  if (isApiKeyRejected) {
    return { message: API_KEY_REJECTED_MESSAGE, isAccountFailure: true };
  }

  const knownMessage = MESSAGE_BY_STATUS[status];

  return {
    message:
      knownMessage ??
      (isDefined(lushaMessage)
        ? `Lusha request failed (HTTP ${status}): ${lushaMessage}`
        : `Lusha request failed (HTTP ${status}).`),
    isAccountFailure: ACCOUNT_FAILURE_STATUSES.has(status),
  };
};
