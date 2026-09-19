import { isNonEmptyString, isString } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import { normalizeEnumValue } from 'src/utils/normalize-enum-value';

export const pickSelect = ({
  raw,
  allowedValues,
  transform = normalizeEnumValue,
}: {
  raw: unknown;
  allowedValues: Set<string>;
  transform?: (value: string) => string | undefined;
}): string | undefined => {
  if (!isString(raw)) {
    return undefined;
  }

  const trimmed = raw.trim();
  if (!isNonEmptyString(trimmed)) {
    return undefined;
  }

  const candidate = transform(trimmed);
  if (!isDefined(candidate) || !allowedValues.has(candidate)) {
    return undefined;
  }

  return candidate;
};
