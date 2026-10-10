import { isNonEmptyString } from '@sniptt/guards';

import { buildEmails } from 'src/logic-functions/utils/build-emails';
import { buildFullName } from 'src/logic-functions/utils/build-full-name';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { buildPhones } from 'src/logic-functions/utils/build-phones';
import { toDropcontactEmails } from 'src/logic-functions/utils/to-dropcontact-emails';
import { toText } from 'src/logic-functions/utils/to-text';
import { type DropcontactPersonData } from 'src/types/dropcontact-person-data';
import { type MappedRecord } from 'src/types/mapped-record';
import { pruneUndefined } from 'src/utils/prune-undefined';

// Qualifications read local@domain, e.g. nominative@pro; either half can be invalid
const isInvalidQualification = (qualification: string | null | undefined) =>
  isNonEmptyString(qualification) && qualification.includes('invalid');

export const mapPerson = (personData: DropcontactPersonData): MappedRecord => {
  const emails = toDropcontactEmails(personData.email);
  const usableEmails = emails.filter(
    (email) => !isInvalidQualification(email.qualification),
  );

  const standard = pruneUndefined({
    name: buildFullName({
      firstName: personData.first_name,
      lastName: personData.last_name,
      fullName: personData.full_name,
    }),
    emails: buildEmails(usableEmails.map((email) => email.email)),
    phones: buildPhones([personData.mobile_phone, personData.phone]),
    jobTitle: toText(personData.job),
    linkedinLink: buildLinks({ url: personData.linkedin }),
  });

  const dropcontact = pruneUndefined({
    dropcontactCivility: toText(personData.civility),
    dropcontactJobLevel: toText(personData.job_level),
    dropcontactJobFunction: toText(personData.job_function),
    dropcontactEmailQualification: toText(emails[0]?.qualification),
    dropcontactCountry: toText(personData.country),
  });

  return { standard, dropcontact };
};
