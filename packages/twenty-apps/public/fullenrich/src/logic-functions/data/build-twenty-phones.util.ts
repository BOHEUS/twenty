import {
  type FullEnrichContactInfo,
  type FullEnrichPhone,
} from 'src/logic-functions/types/fullenrich.types';
import {
  type TwentyAdditionalPhone,
  type TwentyPhones,
} from 'src/logic-functions/types/twenty.types';

const parsePhone = (phone: FullEnrichPhone): TwentyAdditionalPhone => {
  const [callingCode, ...rest] = phone.number.trim().split(' ');

  return rest.length > 0
    ? { number: rest.join(' '), callingCode, countryCode: phone.region }
    : { number: phone.number, callingCode: '', countryCode: phone.region };
};

// `phones` may also carry numbers FullEnrich itself refused to promote to
// most_probable_phone, so the ones it flagged as dead or misattributed are dropped
const isUsable = (phone: FullEnrichPhone): boolean =>
  !!phone.number &&
  phone.line_status !== 'INACTIVE' &&
  phone.ownership_match !== 'MISMATCH';

export const buildTwentyPhones = (
  contactInfo: FullEnrichContactInfo,
): TwentyPhones | undefined => {
  const usablePhones = (contactInfo.phones ?? []).filter(isUsable);
  const mostProbablePhone = contactInfo.most_probable_phone;
  const primaryPhone = mostProbablePhone?.number
    ? mostProbablePhone
    : usablePhones[0];

  if (!primaryPhone) {
    return undefined;
  }

  const parsedPrimaryPhone = parsePhone(primaryPhone);
  const additionalPhones = usablePhones
    .filter((phone) => phone.number !== primaryPhone.number)
    .map(parsePhone);

  return {
    primaryPhoneNumber: parsedPrimaryPhone.number,
    primaryPhoneCallingCode: parsedPrimaryPhone.callingCode,
    primaryPhoneCountryCode: parsedPrimaryPhone.countryCode,
    additionalPhones: additionalPhones.length > 0 ? additionalPhones : null,
  };
};
