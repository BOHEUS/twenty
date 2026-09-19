import { isEmptyText } from 'src/logic-functions/utils/is-empty-text';
import { isRecord } from 'src/utils/is-record';

export const isEmptyAddress = (value: unknown): boolean =>
  !isRecord(value) ||
  (isEmptyText(value.addressStreet1) &&
    isEmptyText(value.addressStreet2) &&
    isEmptyText(value.addressCity) &&
    isEmptyText(value.addressPostcode) &&
    isEmptyText(value.addressState) &&
    isEmptyText(value.addressCountry));
