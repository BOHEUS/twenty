import { isObject } from '@sniptt/guards';

import { isEmptyText } from 'src/logic-functions/utils/is-empty-text';

export const isEmptyAddress = (value: unknown): boolean => {
  if (!isObject(value)) {
    return true;
  }

  const address = value as Record<string, unknown>;

  return (
    isEmptyText(address.addressStreet1) &&
    isEmptyText(address.addressStreet2) &&
    isEmptyText(address.addressCity) &&
    isEmptyText(address.addressPostcode) &&
    isEmptyText(address.addressState) &&
    isEmptyText(address.addressCountry)
  );
};
