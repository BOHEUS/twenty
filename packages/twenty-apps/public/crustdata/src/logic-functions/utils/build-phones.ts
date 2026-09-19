import { isNonEmptyArray } from '@sniptt/guards';

import { splitE164Phone } from 'src/logic-functions/utils/split-e164-phone';
import { type PhonesValue } from 'src/types/phones-value';
import { isDefined } from 'src/utils/is-defined';

export const buildPhones = (
  phoneCandidates: (string | null | undefined)[],
): PhonesValue | undefined => {
  const parsedPhones: { number: string; callingCode: string }[] = [];
  const seenPhoneNumbers = new Set<string>();

  for (const candidate of phoneCandidates) {
    const parsedPhone = splitE164Phone(candidate);
    const phoneKey = isDefined(parsedPhone)
      ? `${parsedPhone.callingCode}${parsedPhone.number}`
      : undefined;

    if (
      !isDefined(parsedPhone) ||
      !isDefined(phoneKey) ||
      parsedPhone.number === '' ||
      seenPhoneNumbers.has(phoneKey)
    ) {
      continue;
    }

    seenPhoneNumbers.add(phoneKey);
    parsedPhones.push(parsedPhone);
  }

  const [primaryPhone, ...additionalPhones] = parsedPhones;

  if (!isDefined(primaryPhone)) {
    return undefined;
  }

  return {
    primaryPhoneNumber: primaryPhone.number,
    primaryPhoneCountryCode: '',
    primaryPhoneCallingCode: primaryPhone.callingCode,
    additionalPhones: isNonEmptyArray(additionalPhones)
      ? additionalPhones.map((phone) => ({
          number: phone.number,
          countryCode: '',
          callingCode: phone.callingCode,
        }))
      : null,
  };
};
