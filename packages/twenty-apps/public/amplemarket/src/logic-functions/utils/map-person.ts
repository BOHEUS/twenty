import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildEmails } from 'src/logic-functions/utils/build-emails';
import { buildFullName } from 'src/logic-functions/utils/build-full-name';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { buildPhones } from 'src/logic-functions/utils/build-phones';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { toText } from 'src/logic-functions/utils/to-text';
import { type AmplemarketPerson } from 'src/types/amplemarket-person';
import { type MappedRecord } from 'src/types/mapped-record';
import { pruneUndefined } from 'src/utils/prune-undefined';

const toDatePart = (value: unknown): string | undefined =>
  toText(value)?.slice(0, 10);

export const mapPerson = (person: AmplemarketPerson): MappedRecord => {
  // Numbers flagged as wrong are kept out of the person's phones
  const usablePhoneNumbers = (person.phone_numbers ?? []).filter(
    (phoneNumber) => phoneNumber.is_wrong_number !== true,
  );
  const latitude = toNumber(person.location_details?.lat);
  const longitude = toNumber(person.location_details?.long);

  const standard = pruneUndefined({
    name: buildFullName({
      firstName: person.first_name,
      lastName: person.last_name,
      fullName: person.name,
    }),
    emails: buildEmails([person.email]),
    phones: buildPhones(
      usablePhoneNumbers.map((phoneNumber) => phoneNumber.number),
    ),
    jobTitle: toText(person.title),
    linkedinLink: buildLinks({ url: person.linkedin_url }),
  });

  const amplemarket = pruneUndefined({
    amplemarketId: toText(person.id),
    amplemarketHeadline: toText(person.headline),
    amplemarketAbout: toText(person.about),
    amplemarketGender: toText(person.gender),
    amplemarketLocation: buildAddress({
      city: person.location_details?.city,
      state: person.location_details?.state,
      country: person.location_details?.country,
      geo:
        latitude !== undefined && longitude !== undefined
          ? `${latitude},${longitude}`
          : undefined,
    }),
    amplemarketJobStartDate: toDatePart(person.current_position_start_date),
    amplemarketJobDescription: toText(person.current_position_description),
    amplemarketExperiences: toJsonArray(person.experiences),
    amplemarketEducations: toJsonArray(person.educations),
    amplemarketLanguages: toJsonArray(person.languages),
    amplemarketPhoneDetails: toJsonArray(person.phone_numbers),
  });

  return { standard, amplemarket };
};
