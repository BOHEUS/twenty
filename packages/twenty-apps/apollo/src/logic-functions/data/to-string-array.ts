import { isDefined } from './is-defined';
import { toText } from './to-text';

export const toStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const entries = value.map(toText).filter(isDefined);

  return entries.length > 0 ? entries : undefined;
};
