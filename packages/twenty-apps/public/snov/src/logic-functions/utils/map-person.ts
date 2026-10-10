import { isNumber } from '@sniptt/guards';

import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildEmails } from 'src/logic-functions/utils/build-emails';
import { buildFullName } from 'src/logic-functions/utils/build-full-name';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { findLinkedinSocialLink } from 'src/logic-functions/utils/find-linkedin-social-link';
import { parsePartialDate } from 'src/logic-functions/utils/parse-partial-date';
import { toCurrentEmployer } from 'src/logic-functions/utils/to-current-employer';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toStringArray } from 'src/logic-functions/utils/to-string-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { type MappedRecord } from 'src/types/mapped-record';
import { type SnovPersonData } from 'src/types/snov-person-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

const toDatePart = (dateTime: unknown) =>
  parsePartialDate(toText(dateTime)?.slice(0, 10));

export const mapPerson = (personData: SnovPersonData): MappedRecord => {
  const { emailProfile, linkedinProfile, emailCheck } = personData;
  const currentEmployer = toCurrentEmployer(personData);

  const standard = pruneUndefined({
    name: buildFullName({
      firstName: emailProfile?.firstName ?? linkedinProfile?.first_name,
      lastName: emailProfile?.lastName ?? linkedinProfile?.last_name,
      fullName: emailProfile?.name ?? linkedinProfile?.name,
    }),
    // Only an email Snov.io verified as deliverable is written
    emails:
      emailCheck?.smtp_status === 'valid'
        ? buildEmails([personData.email])
        : undefined,
    jobTitle: currentEmployer.title,
    linkedinLink: buildLinks({ url: findLinkedinSocialLink(emailProfile) }),
  });

  const snov = pruneUndefined({
    snovId: isNumber(emailProfile?.id)
      ? String(emailProfile.id)
      : toText(emailProfile?.id),
    snovIndustry: toText(emailProfile?.industry ?? linkedinProfile?.industry),
    snovLocation: buildAddress({
      city: emailProfile?.locality ?? linkedinProfile?.location,
      country: emailProfile?.country ?? linkedinProfile?.country,
    }),
    snovJobStartDate: toDatePart(currentEmployer.startDate),
    snovPreviousJobs: toJsonArray(emailProfile?.previousJobs),
    snovSocialProfiles: toJsonArray(emailProfile?.social),
    snovSkills: toStringArray(linkedinProfile?.skills),
    snovEmailStatus: toText(emailCheck?.smtp_status),
    snovFoundEmail: toText(personData.email),
    snovLastUpdatedAt: toDatePart(emailProfile?.lastUpdateDate),
  });

  return { standard, snov };
};
