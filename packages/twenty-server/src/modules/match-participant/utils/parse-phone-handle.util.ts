import { type CountryCode, parsePhoneNumberWithError } from 'libphonenumber-js';

export type ParsedPhoneHandle = {
  callingCode: string;
  nationalNumber: string;
  // A calling code does not always name one country (+1 spans twenty of them).
  countryCode: CountryCode | undefined;
};

// Twenty stores a phone split into calling code and national number, so a
// handle has to be parsed the same way before it can be compared. Providers
// disagree on the leading plus (a WhatsApp wa_id has none), so add it back.
export const parsePhoneHandle = (
  handle: string,
): ParsedPhoneHandle | undefined => {
  const trimmedHandle = handle.trim();

  if (trimmedHandle.length === 0) {
    return undefined;
  }

  try {
    const phoneNumber = parsePhoneNumberWithError(
      trimmedHandle.startsWith('+') ? trimmedHandle : `+${trimmedHandle}`,
    );

    return {
      callingCode: `+${phoneNumber.countryCallingCode}`,
      nationalNumber: phoneNumber.nationalNumber,
      countryCode: phoneNumber.country,
    };
  } catch {
    return undefined;
  }
};
