import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildEmails } from 'src/logic-functions/utils/build-emails';
import { buildFullName } from 'src/logic-functions/utils/build-full-name';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { buildPhones } from 'src/logic-functions/utils/build-phones';
import { collectPersonEmails } from 'src/logic-functions/utils/collect-person-emails';
import { findCurrentJob } from 'src/logic-functions/utils/find-current-job';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toJsonObject } from 'src/logic-functions/utils/to-json-object';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { toStringArray } from 'src/logic-functions/utils/to-string-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { type MappedRecord } from 'src/types/mapped-record';
import { type RocketReachPersonData } from 'src/types/rocketreach-person-data';
import { isDefined } from 'src/logic-functions/utils/is-defined';
import { pruneUndefined } from 'src/logic-functions/utils/prune-undefined';

export const mapPerson = (personData: RocketReachPersonData): MappedRecord => {
  const currentJob = findCurrentJob(personData.job_history);
  const profileId = toNumber(personData.id);

  const standard = pruneUndefined({
    name: buildFullName(personData.name),
    emails: buildEmails(collectPersonEmails(personData)),
    phones: buildPhones(personData.phones),
    jobTitle: toText(personData.current_title) ?? toText(currentJob?.title),
    linkedinLink: buildLinks({ url: personData.linkedin_url }),
  });

  const rocketReach = pruneUndefined({
    rocketReachId: isDefined(profileId) ? String(profileId) : undefined,

    rocketReachDepartment: toText(currentJob?.department),
    rocketReachSubDepartment: toText(currentJob?.sub_department),
    rocketReachSeniority: toText(currentJob?.highest_level),

    rocketReachJobHistory: toJsonArray(personData.job_history),
    rocketReachEducation: toJsonArray(personData.education),
    rocketReachSkills: toStringArray(personData.skills),
    rocketReachLinks: toJsonObject(personData.links),

    rocketReachLinkedinConnections: toNumber(personData.connections),
    rocketReachLinkedinActive: personData.linkedin_url_active ?? undefined,
    rocketReachBirthYear: toNumber(personData.birth_year),

    rocketReachEmailDetails: toJsonArray(personData.emails),
    rocketReachPersonalEmail: toText(personData.recommended_personal_email),
    rocketReachPhoneDetails: toJsonArray(personData.phones),
    rocketReachNpiData: toJsonObject(personData.npi_data),

    rocketReachLocation: buildAddress({
      city: personData.city,
      state: personData.region,
      country: personData.country,
      latitude: personData.region_latitude,
      longitude: personData.region_longitude,
    }),
  });

  return { standard, rocketReach };
};
