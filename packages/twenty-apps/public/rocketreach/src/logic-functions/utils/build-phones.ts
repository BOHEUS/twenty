import { isArray, isNonEmptyArray } from '@sniptt/guards';

import { toCountryCode } from 'src/logic-functions/utils/to-country-code';
import { toText } from 'src/logic-functions/utils/to-text';
import { type RocketReachPhone } from 'src/types/rocketreach-person-data';
import { type PhonesValue } from 'src/types/phones-value';
import { isDefined } from 'src/logic-functions/utils/is-defined';

// RocketReach numbers arrive in E.164, which already carries the calling code,
// so only the ISO country code is stored alongside it.
export const buildPhones = (
  rawPhones: unknown,
): PhonesValue | undefined => {
  if (!isArray(rawPhones)) {
    return undefined;
  }

  const phones = rawPhones as RocketReachPhone[];
  const recommendedFirst = [
    ...phones.filter((phone) => phone?.recommended === true),
    ...phones.filter((phone) => phone?.recommended !== true),
  ];

  const candidates: { number: string; countryCode: string }[] = [];
  const seenNumbers = new Set<string>();

  for (const phone of recommendedFirst) {
    const phoneNumber = toText(phone?.e164) ?? toText(phone?.number);
    if (!isDefined(phoneNumber) || seenNumbers.has(phoneNumber)) {
      continue;
    }

    seenNumbers.add(phoneNumber);
    candidates.push({
      number: phoneNumber,
      countryCode: toCountryCode(phone?.country_code) ?? '',
    });
  }

  const [primaryPhone, ...additionalPhones] = candidates;
  if (!isDefined(primaryPhone)) {
    return undefined;
  }

  return {
    primaryPhoneNumber: primaryPhone.number,
    primaryPhoneCountryCode: primaryPhone.countryCode,
    primaryPhoneCallingCode: '',
    additionalPhones: isNonEmptyArray(additionalPhones)
      ? additionalPhones.map((phone) => ({
          number: phone.number,
          countryCode: phone.countryCode,
          callingCode: '',
        }))
      : null,
  };
};
