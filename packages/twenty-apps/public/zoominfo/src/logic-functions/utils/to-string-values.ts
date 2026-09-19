import { isArray } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import { toText } from 'src/logic-functions/utils/to-text';
import { isRecord } from 'src/utils/is-record';

const readValue = (entry: unknown): string | undefined =>
  isRecord(entry) ? toText(entry.value) : toText(entry);

// ZoomInfo returns alternate emails and phones as [{ value, source }] while the
// primary ones are plain strings.
export const toStringValues = (value: unknown): string[] => {
  if (isArray(value)) {
    return value.map(readValue).filter(isDefined);
  }

  const singleValue = toText(value);

  return isDefined(singleValue) ? [singleValue] : [];
};
