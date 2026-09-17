import { isArray } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import { toDigits } from 'src/logic-functions/data/to-digits';
import { toJsonObject } from 'src/logic-functions/data/to-json';
import { toText } from 'src/logic-functions/data/to-text';
import { type PersonRecord } from 'src/logic-functions/types/person-record.type';
import {
  type PhonesValue,
  type PhoneValue,
} from 'src/logic-functions/types/phones-value.type';

// Twenty stores the national number apart from the calling code while Lusha
// sends the international format, so a phone matches on either digit string.
const getPhoneKeys = ({ number, callingCode }: PhoneValue): string[] =>
  [toDigits(number), toDigits(`${callingCode}${number}`)].filter(
    (key) => key.length > 0,
  );

const readPhone = ({
  number,
  countryCode,
  callingCode,
}: {
  number: unknown;
  countryCode: unknown;
  callingCode: unknown;
}): PhoneValue | undefined => {
  const phoneNumber = toText(number);

  return isDefined(phoneNumber)
    ? {
        number: phoneNumber,
        countryCode: toText(countryCode) ?? '',
        callingCode: toText(callingCode) ?? '',
      }
    : undefined;
};

const uniquePhones = (phones: PhoneValue[]): PhoneValue[] => {
  const seenPhoneKeys = new Set<string>();

  return phones.filter((phone) => {
    const phoneKeys = getPhoneKeys(phone);

    if (phoneKeys.some((phoneKey) => seenPhoneKeys.has(phoneKey))) {
      return false;
    }

    phoneKeys.forEach((phoneKey) => seenPhoneKeys.add(phoneKey));

    return true;
  });
};

// Phones Lusha returns are only ever added: the best one becomes primary when
// there is none.
export const mergePhones = ({
  currentPhones,
  lushaPhones,
}: {
  currentPhones: PersonRecord['phones'];
  lushaPhones: PhoneValue[];
}): PhonesValue | undefined => {
  const [bestLushaPhone] = lushaPhones;

  if (!isDefined(bestLushaPhone)) {
    return undefined;
  }

  const currentPrimaryPhone = readPhone({
    number: currentPhones?.primaryPhoneNumber,
    countryCode: currentPhones?.primaryPhoneCountryCode,
    callingCode: currentPhones?.primaryPhoneCallingCode,
  });
  const currentAdditionalPhones = (
    isArray(currentPhones?.additionalPhones)
      ? currentPhones.additionalPhones
      : []
  )
    .map(toJsonObject)
    .filter(isDefined)
    .map((phone) =>
      readPhone({
        number: phone.number,
        countryCode: phone.countryCode,
        callingCode: phone.callingCode,
      }),
    )
    .filter(isDefined);

  const [primaryPhone, ...additionalPhones] = uniquePhones([
    currentPrimaryPhone ?? bestLushaPhone,
    ...currentAdditionalPhones,
    ...lushaPhones,
  ]);

  if (
    isDefined(currentPrimaryPhone) &&
    additionalPhones.length === currentAdditionalPhones.length
  ) {
    return undefined;
  }

  return {
    primaryPhoneNumber: primaryPhone.number,
    primaryPhoneCountryCode: primaryPhone.countryCode,
    primaryPhoneCallingCode: primaryPhone.callingCode,
    additionalPhones: additionalPhones.length > 0 ? additionalPhones : null,
  };
};
