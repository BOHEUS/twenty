import { isEmptyText } from 'src/logic-functions/utils/is-empty-text';
import { isRecord } from 'src/utils/is-record';

export const isEmptyLinks = (value: unknown): boolean =>
  !isRecord(value) || isEmptyText(value.primaryLinkUrl);
