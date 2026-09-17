import { isDefined } from 'twenty-sdk/utils';

import { toNumber } from 'src/logic-functions/data/to-number';
import { toText } from 'src/logic-functions/data/to-text';
import { type AddressValue } from 'src/logic-functions/types/address-value.type';

export const buildAddress = ({
  city,
  state,
  postcode,
  country,
  latitude,
  longitude,
}: {
  city?: unknown;
  state?: unknown;
  postcode?: unknown;
  country?: unknown;
  latitude?: unknown;
  longitude?: unknown;
}): AddressValue | undefined => {
  const addressCity = toText(city);
  const addressState = toText(state);
  const addressPostcode = toText(postcode);
  const addressCountry = toText(country);

  const hasAnyPart = [
    addressCity,
    addressState,
    addressPostcode,
    addressCountry,
  ].some(isDefined);

  if (!hasAnyPart) {
    return undefined;
  }

  return {
    addressStreet1: '',
    addressStreet2: '',
    addressCity: addressCity ?? '',
    addressState: addressState ?? '',
    addressPostcode: addressPostcode ?? '',
    addressCountry: addressCountry ?? '',
    addressLat: toNumber(latitude) ?? null,
    addressLng: toNumber(longitude) ?? null,
  };
};
