import { toText } from 'src/logic-functions/utils/to-text';
import { type AddressParts } from 'src/logic-functions/types/address-parts';
import { type AddressValue } from 'src/logic-functions/types/address-value';
import { isDefined } from 'src/logic-functions/data/is-defined';

export const buildAddress = (parts: AddressParts): AddressValue | undefined => {
  const street1 = toText(parts.street1);
  const street2 = toText(parts.street2);
  const city = toText(parts.city);
  const postcode = toText(parts.postcode);
  const state = toText(parts.state);
  const country = toText(parts.country);

  const hasAnyValue =
    isDefined(street1) ||
    isDefined(street2) ||
    isDefined(city) ||
    isDefined(postcode) ||
    isDefined(state) ||
    isDefined(country);

  if (!hasAnyValue) {
    return undefined;
  }

  return {
    addressStreet1: street1 ?? '',
    addressStreet2: street2 ?? '',
    addressCity: city ?? '',
    addressPostcode: postcode ?? '',
    addressState: state ?? '',
    addressCountry: country ?? '',
    addressLat: null,
    addressLng: null,
  };
};
