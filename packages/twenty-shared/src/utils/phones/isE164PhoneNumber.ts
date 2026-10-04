// E.164: a leading plus, then 2 to 15 digits with no leading zero.
const E164_PHONE_NUMBER_REGEX = /^\+[1-9]\d{1,14}$/;

export const isE164PhoneNumber = (value: string): boolean =>
  E164_PHONE_NUMBER_REGEX.test(value);
