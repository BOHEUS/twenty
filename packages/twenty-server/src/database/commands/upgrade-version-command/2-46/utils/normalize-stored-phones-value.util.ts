import { isNonEmptyString } from '@sniptt/guards';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import {
  getCountryCodesForCallingCode,
  isDefined,
  isValidCountryCode,
  normalizePhoneNumberToE164,
  splitE164PhoneNumber,
} from 'twenty-shared/utils';

export type StoredPhone = {
  number: string | null;
  callingCode: string | null;
  countryCode: string | null;
};

export type StoredPhonesValue = {
  primaryPhoneNumber: string | null;
  primaryPhoneCallingCode: string | null;
  primaryPhoneCountryCode: string | null;
  additionalPhones: Partial<StoredPhone>[] | null;
};

// Rows written before the record transformer existed can hold formatting,
// a trunk prefix, a calling code without its plus or no calling code at
// all. This brings them to the transformer's shape (national number plus
// `+<calling code>`) so the indexed exact-match lookup finds them. A phone
// that cannot be placed is left untouched rather than guessed.
export const normalizeStoredPhone = (phone: StoredPhone): StoredPhone => {
  if (!isNonEmptyString(phone.number)) {
    return phone;
  }

  const e164 = normalizePhoneNumberToE164({
    number: phone.number,
    callingCode: phone.callingCode,
    countryCode: phone.countryCode,
  });
  const split = e164 === null ? null : splitE164PhoneNumber(e164);

  if (e164 === null || split === null) {
    return phone;
  }

  // A stored country that contradicts the resolved calling code would be
  // rejected by the record transformer on the next save, so it is replaced
  // by the inferred one.
  const storedCountryCode =
    isNonEmptyString(phone.countryCode) &&
    isValidCountryCode(phone.countryCode) &&
    getCountryCodesForCallingCode(split.callingCode).includes(
      phone.countryCode,
    )
      ? phone.countryCode
      : (parsePhoneNumberFromString(e164)?.country ?? null);

  return {
    number: split.nationalNumber,
    callingCode: split.callingCode,
    countryCode: storedCountryCode,
  };
};

const isSamePhone = (left: StoredPhone, right: StoredPhone): boolean =>
  left.number === right.number &&
  left.callingCode === right.callingCode &&
  left.countryCode === right.countryCode;

const toStoredPhone = (phone: Partial<StoredPhone>): StoredPhone => ({
  number: phone.number ?? null,
  callingCode: phone.callingCode ?? null,
  countryCode: phone.countryCode ?? null,
});

export const normalizeStoredPhonesValue = (
  value: StoredPhonesValue,
): { value: StoredPhonesValue; hasChanged: boolean } => {
  const primary = toStoredPhone({
    number: value.primaryPhoneNumber,
    callingCode: value.primaryPhoneCallingCode,
    countryCode: value.primaryPhoneCountryCode,
  });
  const normalizedPrimary = normalizeStoredPhone(primary);

  const additionalPhones = Array.isArray(value.additionalPhones)
    ? value.additionalPhones.filter(isDefined).map(toStoredPhone)
    : null;
  const normalizedAdditionalPhones = additionalPhones?.map(normalizeStoredPhone);

  const hasAdditionalChanged =
    isDefined(additionalPhones) &&
    isDefined(normalizedAdditionalPhones) &&
    additionalPhones.some(
      (phone, index) => !isSamePhone(phone, normalizedAdditionalPhones[index]),
    );

  const hasChanged =
    !isSamePhone(primary, normalizedPrimary) || hasAdditionalChanged;

  return {
    hasChanged,
    value: {
      primaryPhoneNumber: normalizedPrimary.number,
      primaryPhoneCallingCode: normalizedPrimary.callingCode,
      primaryPhoneCountryCode: normalizedPrimary.countryCode,
      additionalPhones: normalizedAdditionalPhones ?? value.additionalPhones,
    },
  };
};
