import { toText } from 'src/logic-functions/utils/to-text';
import { isDefined } from 'src/logic-functions/data/is-defined';

export const toDate = (value: unknown): string | undefined => {
  const dateText = toText(value);
  if (!isDefined(dateText)) {
    return undefined;
  }

  const timestamp = Date.parse(dateText);

  return Number.isNaN(timestamp)
    ? undefined
    : new Date(timestamp).toISOString();
};
