import { isArray, isNonEmptyString } from '@sniptt/guards';

import { isRecord } from 'src/utils/is-record';

export const extractHunterErrorMessage = ({
  json,
  httpStatus,
}: {
  json: unknown;
  httpStatus: number;
}): string => {
  const errors = isRecord(json) && isArray(json.errors) ? json.errors : [];
  const message = errors
    .map((error) => (isRecord(error) ? error.details : undefined))
    .filter(isNonEmptyString)
    .join('; ');

  return isNonEmptyString(message)
    ? message
    : `Hunter request failed (HTTP ${httpStatus}).`;
};
