import { parsePhoneNumberFromString } from 'libphonenumber-js';

export type SplitE164PhoneNumber = {
  callingCode: string;
  nationalNumber: string;
};

// Mirrors how the record transformer stores a phone: the national
// significant number in `number` and `+<calling code>` beside it. Exact
// matches against stored rows need both halves, not the joined E.164.
export const splitE164PhoneNumber = (
  e164PhoneNumber: string,
): SplitE164PhoneNumber | null => {
  const parsedPhoneNumber = parsePhoneNumberFromString(e164PhoneNumber);

  if (!parsedPhoneNumber) {
    return null;
  }

  return {
    callingCode: `+${parsedPhoneNumber.countryCallingCode}`,
    nationalNumber: parsedPhoneNumber.nationalNumber,
  };
};
