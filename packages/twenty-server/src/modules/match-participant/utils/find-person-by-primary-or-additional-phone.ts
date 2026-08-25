import { isDefined } from 'twenty-shared/utils';

import { parsePhoneHandle } from 'src/modules/match-participant/utils/parse-phone-handle.util';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export const findPersonByPrimaryOrAdditionalPhone = ({
  people,
  phone,
}: {
  people: PersonWorkspaceEntity[];
  phone: string;
}): PersonWorkspaceEntity | undefined => {
  const parsedPhone = parsePhoneHandle(phone);

  if (!isDefined(parsedPhone)) {
    return undefined;
  }

  const personWithPrimaryPhone = people.find(
    (person) =>
      person.phones?.primaryPhoneNumber === parsedPhone.nationalNumber &&
      person.phones?.primaryPhoneCallingCode === parsedPhone.callingCode,
  );

  if (isDefined(personWithPrimaryPhone)) {
    return personWithPrimaryPhone;
  }

  return people.find((person) => {
    const additionalPhones = person.phones?.additionalPhones;

    if (!Array.isArray(additionalPhones)) {
      return false;
    }

    return additionalPhones.some(
      (additionalPhone) =>
        additionalPhone.number === parsedPhone.nationalNumber &&
        additionalPhone.callingCode === parsedPhone.callingCode,
    );
  });
};
