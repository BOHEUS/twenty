import { toText } from "src/logic-functions/data/to-text";
import { isDefined } from "twenty-sdk/define";

type AddressParts = {
  street?: unknown;
  city?: unknown;
  state?: unknown;
  postcode?: unknown;
  country?: unknown;
};

export const buildAddress = ({
  street,
  city,
  state,
  postcode,
  country,
}: AddressParts):
  | {
      addressStreet1: string;
      addressCity: string;
      addressState: string;
      addressPostcode: string;
      addressCountry: string;
    }
  | undefined => {
  const address = {
    addressStreet1: toText(street) ?? '',
    addressCity: toText(city) ?? '',
    addressState: toText(state) ?? '',
    addressPostcode: toText(postcode) ?? '',
    addressCountry: toText(country) ?? '',
  };

  const hasAnyPart = Object.values(address).some((part) =>
    isDefined(part) ? part !== '' : false,
  );

  return hasAnyPart ? address : undefined;
};
