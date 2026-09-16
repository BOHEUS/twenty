import { isDefined } from './is-defined';
import { toText } from './to-text';

const NON_ALPHANUMERIC_RUN_REGEX = /[^A-Z0-9]+/g;
const LEADING_OR_TRAILING_UNDERSCORE_REGEX = /^_+|_+$/g;

export const pickSelectValue = ({
  raw,
  allowedValues,
}: {
  raw: unknown;
  allowedValues: Set<string>;
}): string | undefined => {
  const text = toText(raw);

  if (!isDefined(text)) {
    return undefined;
  }

  const candidate = text
    .toUpperCase()
    .replace(NON_ALPHANUMERIC_RUN_REGEX, '_')
    .replace(LEADING_OR_TRAILING_UNDERSCORE_REGEX, '');

  return allowedValues.has(candidate) ? candidate : undefined;
};
