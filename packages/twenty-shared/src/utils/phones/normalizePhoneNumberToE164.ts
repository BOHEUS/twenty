import { isNonEmptyString } from '@sniptt/guards';
import {
  type CountryCode,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

import { isValidCountryCode } from '@/utils/validation/phones-value/isValidCountryCode';

export type NormalizePhoneNumberToE164Input = {
  number: string | null | undefined;
  callingCode?: string | null;
  countryCode?: string | null;
  defaultCountryCode?: string | null;
};

const toCountryCodeOrUndefined = (
  value: string | null | undefined,
): CountryCode | undefined =>
  isNonEmptyString(value) && isValidCountryCode(value) ? value : undefined;

const stripToDigits = (value: string): string => value.replace(/\D/g, '');

// Resolution order mirrors how much the caller knows: an international
// number is self-describing, a stored calling code beats a country code,
// and the workspace default only applies when nothing else is known.
// A number that cannot be placed in a country is returned as null rather
// than guessed, so a caller never links a record on a fabricated number.
export const normalizePhoneNumberToE164 = ({
  number,
  callingCode,
  countryCode,
  defaultCountryCode,
}: NormalizePhoneNumberToE164Input): string | null => {
  if (!isNonEmptyString(number)) {
    return null;
  }

  const trimmedNumber = number.trim();

  if (trimmedNumber === '') {
    return null;
  }

  const resolvedCountryCode =
    toCountryCodeOrUndefined(countryCode) ??
    toCountryCodeOrUndefined(defaultCountryCode);

  const callingCodeDigits = isNonEmptyString(callingCode)
    ? stripToDigits(callingCode)
    : '';

  const textToParse =
    trimmedNumber.startsWith('+') || callingCodeDigits === ''
      ? trimmedNumber
      : `+${callingCodeDigits} ${trimmedNumber}`;

  const parsedPhoneNumber = parsePhoneNumberFromString(
    textToParse,
    resolvedCountryCode,
  );

  // isPossible() checks length and country, not range assignment. isValid()
  // would reject numbers in ranges the bundled metadata does not know yet,
  // and the fictional ranges CRM data is full of, which must still
  // normalize so a stored number and its caller ID compare equal.
  if (!parsedPhoneNumber || !parsedPhoneNumber.isPossible()) {
    return null;
  }

  return parsedPhoneNumber.number;
};
