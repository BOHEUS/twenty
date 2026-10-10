import { isArray, isObject, isString } from '@sniptt/guards';

import { EMAIL_STATUS_OPTIONS } from 'src/constants/email-status-options';
import { GENDER_OPTIONS } from 'src/constants/gender-options';
import { JOB_DEPARTMENT_OPTIONS } from 'src/constants/job-department-options';
import { JOB_LEVEL_OPTIONS } from 'src/constants/job-level-options';
import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildAllowedValues } from 'src/logic-functions/utils/build-allowed-values';
import { buildEmails } from 'src/logic-functions/utils/build-emails';
import { buildFullName } from 'src/logic-functions/utils/build-full-name';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { buildPhones } from 'src/logic-functions/utils/build-phones';
import { pickMultiSelect } from 'src/logic-functions/utils/pick-multi-select';
import { pickSelect } from 'src/logic-functions/utils/pick-select';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toStringArray } from 'src/logic-functions/utils/to-string-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { type ExploriumPersonData } from 'src/types/explorium-person-data';
import { type MappedRecord } from 'src/types/mapped-record';
import { pruneUndefined } from 'src/utils/prune-undefined';

const GENDER_VALUES = buildAllowedValues(GENDER_OPTIONS);
const EMAIL_STATUS_VALUES = buildAllowedValues(EMAIL_STATUS_OPTIONS);
const JOB_LEVEL_VALUES = buildAllowedValues(JOB_LEVEL_OPTIONS);
const JOB_DEPARTMENT_VALUES = buildAllowedValues(JOB_DEPARTMENT_OPTIONS);

const toPhoneNumbers = (phoneNumbers: unknown): string[] =>
  (isArray(phoneNumbers) ? phoneNumbers : []).flatMap((phoneNumberEntry) =>
    isObject(phoneNumberEntry)
      ? Object.values(phoneNumberEntry).filter(isString)
      : isString(phoneNumberEntry)
        ? [phoneNumberEntry]
        : [],
  );

const withMainValueFirst = (
  mainValue: string | null | undefined,
  values: string[] | null | undefined,
): unknown[] => [mainValue, ...(isArray(values) ? values : [])];

export const mapPerson = (personData: ExploriumPersonData): MappedRecord => {
  const standard = pruneUndefined({
    name: buildFullName({
      firstName: personData.first_name,
      lastName: personData.last_name,
      fullName: personData.full_name,
    }),
    emails:
      personData.professional_email_status === 'invalid'
        ? undefined
        : buildEmails([personData.professional_email]),
    phones: buildPhones([
      personData.mobile_phone,
      ...toPhoneNumbers(personData.phone_numbers),
    ]),
    jobTitle: toText(personData.job_title),
    linkedinLink: buildLinks({ url: personData.linkedin }),
  });

  const explorium = pruneUndefined({
    exploriumId: toText(personData.prospect_id),
    exploriumGender: pickSelect({
      raw: personData.gender,
      allowedValues: GENDER_VALUES,
    }),
    exploriumAgeGroup: toText(personData.age_group),
    exploriumEmailStatus: pickSelect({
      raw: personData.professional_email_status,
      allowedValues: EMAIL_STATUS_VALUES,
    }),
    exploriumJobLevels: pickMultiSelect({
      rawValues: withMainValueFirst(
        personData.job_level_main,
        personData.job_level_array,
      ),
      allowedValues: JOB_LEVEL_VALUES,
    }),
    exploriumJobDepartments: pickMultiSelect({
      rawValues: withMainValueFirst(
        personData.job_department_main,
        personData.job_department_array,
      ),
      allowedValues: JOB_DEPARTMENT_VALUES,
    }),
    exploriumSkills: toStringArray(personData.skills),
    exploriumInterests: toStringArray(personData.interests),
    exploriumLinkedinUrls: toStringArray(personData.linkedin_url_array),
    exploriumExperience: toJsonArray(personData.experience),
    exploriumEducation: toJsonArray(personData.education),
    exploriumLocation: buildAddress({
      city: personData.city,
      state: personData.region_name,
      country: personData.country_name,
    }),
  });

  return { standard, explorium };
};
