import { type PhoneLookupCandidate } from 'twenty-shared/application';
import { isDefined, normalizePhoneNumberToE164 } from 'twenty-shared/utils';

import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

type PersonPhoneFields = Pick<PersonWorkspaceEntity, 'id' | 'phones'>;

export const findPersonPhoneMatches = ({
  people,
  normalizedPhoneNumber,
  defaultCountryCode,
}: {
  people: PersonPhoneFields[];
  normalizedPhoneNumber: string;
  defaultCountryCode?: string;
}): PhoneLookupCandidate[] =>
  people
    .map((person): PhoneLookupCandidate | null => {
      const primary = normalizePhoneNumberToE164({
        number: person.phones?.primaryPhoneNumber,
        callingCode: person.phones?.primaryPhoneCallingCode,
        countryCode: person.phones?.primaryPhoneCountryCode,
        defaultCountryCode,
      });

      if (primary === normalizedPhoneNumber) {
        return {
          personId: person.id,
          matchBasis: 'PRIMARY_PHONE',
          matchedPhoneNumber: primary,
        };
      }

      const additionalPhones = Array.isArray(person.phones?.additionalPhones)
        ? person.phones.additionalPhones
        : [];

      const additionalMatch = additionalPhones
        .map((additionalPhone) =>
          normalizePhoneNumberToE164({
            number: additionalPhone?.number,
            callingCode: additionalPhone?.callingCode,
            countryCode: additionalPhone?.countryCode,
            defaultCountryCode,
          }),
        )
        .find((candidate) => candidate === normalizedPhoneNumber);

      if (isDefined(additionalMatch)) {
        return {
          personId: person.id,
          matchBasis: 'ADDITIONAL_PHONE',
          matchedPhoneNumber: additionalMatch,
        };
      }

      return null;
    })
    .filter(isDefined);
