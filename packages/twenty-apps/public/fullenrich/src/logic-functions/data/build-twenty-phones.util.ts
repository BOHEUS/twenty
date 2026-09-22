import {
  ContactInfo,
  PhoneInfo,
  twentyAdditionalPhone,
  twentyPersonPhones,
} from "src/logic-functions/shared/types";

const parsePhone = (phone: PhoneInfo): twentyAdditionalPhone => {
  const [callingCode, ...rest] = phone.number.trim().split(' ');
  return rest.length > 0
    ? { number: rest.join(' '), callingCode, countryCode: phone.region }
    : { number: phone.number, callingCode: '', countryCode: phone.region };
};

export const buildTwentyPhones = (contactInfo: ContactInfo): twentyPersonPhones => {
  const mostProbablePhone = contactInfo.most_probable_phone;
  if (!mostProbablePhone) {
    return {
      primaryPhoneNumber: '',
      primaryPhoneCallingCode: '',
      primaryPhoneCountryCode: '',
      additionalPhones: null,
    };
  }
  const primaryPhone = parsePhone(mostProbablePhone);
  const additionalPhones = (contactInfo.phones ?? [])
    .filter((phone) => phone.number !== mostProbablePhone.number)
    .map(parsePhone);
  return {
    primaryPhoneNumber: primaryPhone.number,
    primaryPhoneCallingCode: primaryPhone.callingCode,
    primaryPhoneCountryCode: primaryPhone.countryCode,
    additionalPhones: additionalPhones.length > 0 ? additionalPhones : null,
  };
};
