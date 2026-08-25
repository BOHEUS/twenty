import { isNonEmptyString } from '@sniptt/guards';
import { type PhonesMetadata } from 'twenty-shared/types';

// A participant handle is stored exactly as the provider sent it, and providers
// disagree on the leading plus, so a person's stored phone maps to both forms.
export const buildPhoneHandleCandidates = (
  phones: PhonesMetadata | null | undefined,
): string[] => {
  if (
    !isNonEmptyString(phones?.primaryPhoneNumber) &&
    !phones?.additionalPhones
  ) {
    return [];
  }

  const allPhones = [
    {
      callingCode: phones?.primaryPhoneCallingCode,
      number: phones?.primaryPhoneNumber,
    },
    ...(phones?.additionalPhones ?? []),
  ];

  return allPhones.flatMap(({ callingCode, number }) => {
    if (!isNonEmptyString(callingCode) || !isNonEmptyString(number)) {
      return [];
    }

    const callingCodeWithoutPlus = callingCode.replace('+', '');

    return [
      `+${callingCodeWithoutPlus}${number}`,
      `${callingCodeWithoutPlus}${number}`,
    ];
  });
};
