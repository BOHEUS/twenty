import { toText } from 'src/logic-functions/utils/to-text';
import { isDefined } from 'src/logic-functions/utils/is-defined';

const ISO_ALPHA_2_REGEX = /^[A-Za-z]{2}$/;

export const toCountryCode = (value: unknown): string | undefined => {
  const countryCode = toText(value);

  if (!isDefined(countryCode) || !ISO_ALPHA_2_REGEX.test(countryCode)) {
    return undefined;
  }

  return countryCode.toUpperCase();
};
