import { isArray } from '@sniptt/guards';

import { AUTHENTICITY_VERDICT_OPTIONS } from 'src/constants/authenticity-verdict-options';
import { EMAIL_STATUS_OPTIONS } from 'src/constants/email-status-options';
import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildAllowedValues } from 'src/logic-functions/utils/build-allowed-values';
import { buildEmails } from 'src/logic-functions/utils/build-emails';
import { buildFullName } from 'src/logic-functions/utils/build-full-name';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { buildPhones } from 'src/logic-functions/utils/build-phones';
import { buildXLinkFromSlug } from 'src/logic-functions/utils/build-x-link-from-slug';
import { collectEmails } from 'src/logic-functions/utils/collect-emails';
import { currentEmployment } from 'src/logic-functions/utils/current-employment';
import { parsePartialDate } from 'src/logic-functions/utils/parse-partial-date';
import { pickSelect } from 'src/logic-functions/utils/pick-select';
import { toIdText } from 'src/logic-functions/utils/to-id-text';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { toStringArray } from 'src/logic-functions/utils/to-string-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CrustdataPersonData } from 'src/types/crustdata-person-data';
import { type MappedRecord } from 'src/types/mapped-record';
import { pruneUndefined } from 'src/utils/prune-undefined';

const AUTHENTICITY_VERDICT_VALUES = buildAllowedValues(
  AUTHENTICITY_VERDICT_OPTIONS,
);
const EMAIL_STATUS_VALUES = buildAllowedValues(EMAIL_STATUS_OPTIONS);

export const mapPerson = (personData: CrustdataPersonData): MappedRecord => {
  const basicProfile = personData.basic_profile;
  const professionalNetwork = personData.professional_network;
  const socialHandles = personData.social_handles;
  const contact = personData.contact;
  const currentRole = currentEmployment(personData);

  const businessEmails = collectEmails(contact?.business_emails);
  const personalEmails = collectEmails(contact?.personal_emails);

  const standard = pruneUndefined({
    name: buildFullName({
      firstName: basicProfile?.first_name,
      lastName: basicProfile?.last_name,
      fullName: basicProfile?.name,
    }),
    emails: buildEmails([...businessEmails, ...personalEmails]),
    phones: buildPhones(
      isArray(contact?.phone_numbers) ? contact.phone_numbers : [],
    ),
    jobTitle: toText(basicProfile?.current_title),
    linkedinLink: buildLinks({
      url: socialHandles?.professional_network_identifier?.profile_url,
    }),
  });

  const crustdata = pruneUndefined({
    crustdataPersonId: toIdText(personData.crustdata_person_id),

    crustdataHeadline: toText(basicProfile?.headline),
    crustdataSummary: toText(basicProfile?.summary),
    crustdataLanguages: toStringArray(basicProfile?.languages),
    crustdataPronoun: toText(professionalNetwork?.pronoun),

    crustdataAuthenticityVerdict: pickSelect({
      raw: personData.assessment?.authenticity?.verdict,
      allowedValues: AUTHENTICITY_VERDICT_VALUES,
    }),
    crustdataAuthenticityTier: toNumber(
      personData.assessment?.authenticity?.tier,
    ),

    crustdataLocation: buildAddress({
      city: basicProfile?.location?.city,
      state: basicProfile?.location?.state,
      country: basicProfile?.location?.country,
    }),

    crustdataDepartment: toText(basicProfile?.normalized_title?.department),
    crustdataSubDepartment: toText(
      basicProfile?.normalized_title?.sub_department,
    ),
    crustdataNormalizedTitle: toText(
      basicProfile?.normalized_title?.matched_title,
    ),

    // `years_of_experience` is a band such as "More than 10 years"; only the raw figure is a number.
    crustdataYearsOfExperience: toNumber(
      personData.experience?.years_of_experience_raw,
    ),
    crustdataCurrentJobStartDate: parsePartialDate(currentRole?.start_date),
    crustdataPastEmployment: toJsonArray(
      personData.experience?.employment_details?.past,
    ),

    crustdataEducation: toJsonArray(personData.education?.schools),
    crustdataSkills: toStringArray(personData.skills?.professional_network_skills),
    crustdataCertifications: toJsonArray(personData.certifications),
    crustdataHonors: toJsonArray(personData.honors),

    crustdataXLink: buildXLinkFromSlug(socialHandles?.twitter_identifier?.slug),
    crustdataGithubLink: buildLinks({
      url: socialHandles?.dev_platform_identifier?.profile_url,
    }),
    crustdataDevPlatformProfiles: toJsonArray(personData.dev_platform_profiles),

    crustdataConnections: toNumber(professionalNetwork?.connections),
    crustdataFollowers: toNumber(professionalNetwork?.followers),

    crustdataWebsites: toStringArray(contact?.websites),
    crustdataEmailStatus: pickSelect({
      raw: contact?.business_emails?.[0]?.status,
      allowedValues: EMAIL_STATUS_VALUES,
    }),

    crustdataProfileUpdatedAt: toText(personData.updated_at),
  });

  return { standard, crustdata };
};
