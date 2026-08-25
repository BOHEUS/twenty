import { ContactInfo, twentyPersonPhones } from "src/logic-functions/shared/types";

export const buildTwentyPhones = (contactInfo: ContactInfo): twentyPersonPhones => {
  const mostProbablePhone = contactInfo.most_probable_phone;
  if (!mostProbablePhone) {
    return {
      primaryPhoneNumber: '',
      primaryPhoneCallingCode: '',
      additionalPhones: null,
    };
  }
  const [primaryPhoneCallingCode, primaryPhoneNumber] =
    mostProbablePhone.number.split(' ', 2);
  const phones = contactInfo.phones ?? [];
  return {
    primaryPhoneNumber: primaryPhoneNumber ?? '',
    primaryPhoneCallingCode: primaryPhoneCallingCode ?? '',
    additionalPhones:
      phones.length > 1 ? phones.map((phone) => phone.number) : null,
  };
};