import { PHONE_CALLING_CODES } from 'src/constants/phone-calling-codes';
import { toText } from 'src/logic-functions/utils/to-text';
import { isDefined } from 'src/utils/is-defined';

const NON_DIGIT_REGEX = /[^0-9]/g;

// Twenty stores the calling code apart from the national number. The ISO country is deliberately
// left blank: several countries share one calling code (+1 is US and Canada), so E.164 alone
// cannot name the country without guessing.
export const splitE164Phone = (
  rawPhoneNumber: unknown,
): { number: string; callingCode: string } | undefined => {
  const phoneText = toText(rawPhoneNumber);

  if (!isDefined(phoneText)) {
    return undefined;
  }

  const digits = phoneText.replace(NON_DIGIT_REGEX, '');

  if (digits === '') {
    return undefined;
  }

  if (!phoneText.startsWith('+')) {
    return { number: digits, callingCode: '' };
  }

  const matchedCallingCode = PHONE_CALLING_CODES.find((callingCode) =>
    digits.startsWith(callingCode),
  );

  if (!isDefined(matchedCallingCode)) {
    return { number: digits, callingCode: '' };
  }

  return {
    number: digits.slice(matchedCallingCode.length),
    callingCode: `+${matchedCallingCode}`,
  };
};
