import { toText } from 'src/logic-functions/utils/to-text';
import { isRecord } from 'src/utils/is-record';

export const readObjectProperty = ({
  value,
  property,
}: {
  value: unknown;
  property: string;
}): string | undefined =>
  isRecord(value) ? toText(value[property]) : undefined;
