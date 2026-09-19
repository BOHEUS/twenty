import { isObject } from '@sniptt/guards';

import { toText } from 'src/logic-functions/utils/to-text';
import { isDefined } from 'src/utils/is-defined';

type CrustdataErrorBody = { error?: { message?: unknown } };

const isCrustdataErrorBody = (value: unknown): value is CrustdataErrorBody =>
  isObject(value);

export const extractCrustdataErrorMessage = ({
  json,
  httpStatus,
}: {
  json: unknown;
  httpStatus: number;
}): string => {
  const message = isCrustdataErrorBody(json)
    ? toText(json.error?.message)
    : toText(json);

  if (!isDefined(message)) {
    return `Crustdata request failed (HTTP ${httpStatus}).`;
  }

  return `${message} (HTTP ${httpStatus})`;
};
