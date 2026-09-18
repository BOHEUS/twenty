import { isArray } from '@sniptt/guards';

import { EMAIL_QUALITY_OPTIONS } from 'src/constants/email-quality-options';
import { JOB_FUNCTION_OPTIONS } from 'src/constants/job-function-options';
import { MANAGEMENT_LEVEL_OPTIONS } from 'src/constants/management-level-options';
import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildAllowedValues } from 'src/logic-functions/utils/build-allowed-values';
import { buildEmails } from 'src/logic-functions/utils/build-emails';
import { buildFullName } from 'src/logic-functions/utils/build-full-name';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { buildPhones } from 'src/logic-functions/utils/build-phones';
import { pickMultiSelect } from 'src/logic-functions/utils/pick-multi-select';
import { pickSelect } from 'src/logic-functions/utils/pick-select';
import { toBoolean } from 'src/logic-functions/utils/to-boolean';
import { toDate } from 'src/logic-functions/utils/to-date';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toMultiValue } from 'src/logic-functions/utils/to-multi-value';
import { toStringArray } from 'src/logic-functions/utils/to-string-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CognismPersonData } from 'src/logic-functions/types/cognism-person-data';
import { type MappedRecord } from 'src/logic-functions/types/mapped-record';
import { pruneUndefined } from 'src/logic-functions/data/prune-undefined';

const MANAGEMENT_LEVEL_VALUES = buildAllowedValues(MANAGEMENT_LEVEL_OPTIONS);
const JOB_FUNCTION_VALUES = buildAllowedValues(JOB_FUNCTION_OPTIONS);
const EMAIL_QUALITY_VALUES = buildAllowedValues(EMAIL_QUALITY_OPTIONS);

export const mapPerson = (personData: CognismPersonData): MappedRecord => {
  const mobilePhoneNumbers = isArray(personData.mobilePhoneNumbers)
    ? personData.mobilePhoneNumbers
    : [];

  const standard = pruneUndefined({
    name: buildFullName({
      firstName: personData.firstName,
      lastName: personData.lastName,
      fullName: undefined,
    }),
    emails: buildEmails([personData.email?.address]),
    phones: buildPhones(
      mobilePhoneNumbers.map((phoneNumber) => phoneNumber?.number),
    ),
    jobTitle: toText(personData.jobTitle),
    linkedinLink: buildLinks({ url: personData.linkedinUrl }),
  });

  const cognism = pruneUndefined({
    cognismId: toText(personData.id),
    cognismRedeemId: toText(personData.redeemId),

    cognismLocation: buildAddress({ country: personData.country }),

    cognismManagementLevel: pickSelect({
      raw: personData.managementLevel,
      allowedValues: MANAGEMENT_LEVEL_VALUES,
    }),
    cognismJobFunction: pickMultiSelect({
      rawValues: toMultiValue(personData.jobFunction),
      allowedValues: JOB_FUNCTION_VALUES,
    }),
    cognismEmailQuality: pickSelect({
      raw: personData.email?.quality,
      allowedValues: EMAIL_QUALITY_VALUES,
    }),

    cognismPositionStartDate: toDate(personData.positionStartDate),
    cognismLastConfirmed: toDate(personData.lastConfirmed),

    cognismSkills: toStringArray(personData.skills),

    cognismPreviousAccounts: toJsonArray(personData.previousAccounts),
    cognismEducation: toJsonArray(personData.education),
    cognismPhoneNumbers: toJsonArray(mobilePhoneNumbers),
    cognismJobJoinEvent: toJsonArray(personData.jobJoinEvent),
    cognismJobLeaveEvent: toJsonArray(personData.jobLeaveEvent),

    cognismPrivacyNotificationSent: toBoolean(
      personData.privacyNotificationSent,
    ),
  });

  return { standard, cognism };
};
