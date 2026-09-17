export type PhoneValue = {
  number: string;
  countryCode: string;
  callingCode: string;
};

export type PhonesValue = {
  primaryPhoneNumber: string;
  primaryPhoneCountryCode: string;
  primaryPhoneCallingCode: string;
  additionalPhones: PhoneValue[] | null;
};
