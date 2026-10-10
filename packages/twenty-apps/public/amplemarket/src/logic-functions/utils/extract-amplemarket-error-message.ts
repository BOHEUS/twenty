import { isArray, isNonEmptyString } from '@sniptt/guards';

import { isRecord } from 'src/utils/is-record';

export const extractAmplemarketErrorMessage = ({
  json,
  httpStatus,
}: {
  json: unknown;
  httpStatus: number;
}): string => {
  const errors = isRecord(json) && isArray(json._errors) ? json._errors : [];
  const message = errors
    .map((error) =>
      isRecord(error) ? (error.detail ?? error.title) : undefined,
    )
    .filter(isNonEmptyString)
    .join('; ');

  return isNonEmptyString(message)
    ? message
    : `Amplemarket request failed (HTTP ${httpStatus}).`;
};
