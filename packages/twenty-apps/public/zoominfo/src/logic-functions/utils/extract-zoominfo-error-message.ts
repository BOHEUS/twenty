import { isNonEmptyString } from '@sniptt/guards';

import { isRecord } from 'src/utils/is-record';

export const extractZoomInfoErrorMessage = ({
  json,
  httpStatus,
}: {
  json: unknown;
  httpStatus: number;
}): string => {
  const errorField = isRecord(json) ? json.error : undefined;

  if (isRecord(errorField) && isNonEmptyString(errorField.message)) {
    return errorField.message;
  }

  return `ZoomInfo request failed (HTTP ${httpStatus}).`;
};
