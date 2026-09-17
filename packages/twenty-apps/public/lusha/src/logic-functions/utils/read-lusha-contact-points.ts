import { isDefined } from 'twenty-sdk/utils';

import { toDigits } from 'src/logic-functions/data/to-digits';
import { toEmail } from 'src/logic-functions/data/to-email';
import { toJsonArray, toJsonObject } from 'src/logic-functions/data/to-json';
import { toText } from 'src/logic-functions/data/to-text';
import { type LushaRecord } from 'src/logic-functions/types/lusha-record.type';
import { type PhoneValue } from 'src/logic-functions/types/phones-value.type';

const EMAIL_TYPE_PRIORITY = ['work', 'unknown', 'private'];
const PHONE_TYPE_PRIORITY = ['mobile', 'direct', 'work', 'unknown'];
const MINIMUM_PHONE_DIGITS = 7;
const COUNTRY_CODE_REGEX = /^[A-Z]{2}$/;

const readObjects = (value: unknown): LushaRecord[] =>
  (toJsonArray(value) ?? []).map(toJsonObject).filter(isDefined);

const getTypeRank = ({
  priorities,
  type,
}: {
  priorities: string[];
  type: unknown;
}): number => {
  const rank = priorities.indexOf(toText(type)?.toLowerCase() ?? '');

  return rank === -1 ? priorities.length : rank;
};

export const sortLushaEmails = (contact: LushaRecord): LushaRecord[] =>
  readObjects(contact.emails).sort(
    (firstEmail, secondEmail) =>
      getTypeRank({ priorities: EMAIL_TYPE_PRIORITY, type: firstEmail.type }) -
      getTypeRank({ priorities: EMAIL_TYPE_PRIORITY, type: secondEmail.type }),
  );

export const readLushaEmails = (contact: LushaRecord): string[] =>
  sortLushaEmails(contact)
    .map((email) => toEmail(email.email))
    .filter(isDefined);

const toPhoneValue = ({
  number,
  countryCode,
}: {
  number: unknown;
  countryCode: unknown;
}): PhoneValue | undefined => {
  const phoneNumber = toText(number);

  if (
    !isDefined(phoneNumber) ||
    toDigits(phoneNumber).length < MINIMUM_PHONE_DIGITS
  ) {
    return undefined;
  }

  const upperCaseCountryCode = toText(countryCode)?.toUpperCase();

  // Twenty parses phone numbers when saving them, and a number written without
  // its calling code only parses with the country it belongs to.
  return {
    number: phoneNumber,
    countryCode:
      !phoneNumber.startsWith('+') &&
      isDefined(upperCaseCountryCode) &&
      COUNTRY_CODE_REGEX.test(upperCaseCountryCode)
        ? upperCaseCountryCode
        : '',
    callingCode: '',
  };
};

// Numbers on a do-not-call list go last so they never become the primary phone
// while another number is available.
export const readLushaContactPhones = (contact: LushaRecord): PhoneValue[] => {
  const countryCode = toJsonObject(contact.location)?.countryIso2;

  return readObjects(contact.phones)
    .sort(
      (firstPhone, secondPhone) =>
        Number(firstPhone.doNotCall === true) -
          Number(secondPhone.doNotCall === true) ||
        getTypeRank({
          priorities: PHONE_TYPE_PRIORITY,
          type: firstPhone.type,
        }) -
          getTypeRank({
            priorities: PHONE_TYPE_PRIORITY,
            type: secondPhone.type,
          }),
    )
    .map((phone) => toPhoneValue({ number: phone.number, countryCode }))
    .filter(isDefined);
};

// The documented schema has a single phone string, while Lusha's own examples
// return a phones list, so both are read.
export const readLushaCompanyPhones = (company: LushaRecord): PhoneValue[] => {
  const countryCode = toJsonObject(company.location)?.countryIso2;

  return [
    company.phone,
    ...readObjects(company.phones).map((phone) => phone.number),
  ]
    .map((number) => toPhoneValue({ number, countryCode }))
    .filter(isDefined);
};
