import { toText } from 'src/logic-functions/utils/to-text';
import { isDefined } from 'src/logic-functions/utils/is-defined';

const TRUE_VALUES = new Set(['true', '1', 'yes', 'on']);
const FALSE_VALUES = new Set(['false', '0', 'no', 'off']);

export const parseBooleanVariable = (
  rawValue: string | undefined,
): boolean | undefined => {
  const value = toText(rawValue)?.toLowerCase();

  if (!isDefined(value)) {
    return undefined;
  }

  if (TRUE_VALUES.has(value)) {
    return true;
  }

  return FALSE_VALUES.has(value) ? false : undefined;
};
