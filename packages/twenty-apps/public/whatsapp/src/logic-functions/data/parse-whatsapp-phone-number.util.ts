import parsePhoneNumber from 'libphonenumber-js/max';

export const parseWhatsappPhoneNumber = (phoneNumber: string) => {
  const number = parsePhoneNumber(phoneNumber);
  return number ? {
    primaryPhoneNumber: number.nationalNumber,
    primaryCallingCode: number.countryCallingCode
  } : undefined;
}