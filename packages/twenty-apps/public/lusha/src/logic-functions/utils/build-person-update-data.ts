import { isDefined } from 'twenty-sdk/utils';

import { LUSHA_SENIORITY_VALUES } from 'src/constants/seniority-options.constant';
import { buildAddress } from 'src/logic-functions/data/build-address';
import { buildLinks } from 'src/logic-functions/data/build-links';
import { normalizeLinkedinUrl } from 'src/logic-functions/data/normalize-linkedin-url';
import { parseLushaDate } from 'src/logic-functions/data/parse-lusha-date';
import { pickSelectValue } from 'src/logic-functions/data/pick-select-value';
import { pruneUndefined } from 'src/logic-functions/data/prune-undefined';
import { toBoolean } from 'src/logic-functions/data/to-boolean';
import { toJsonArray, toJsonObject } from 'src/logic-functions/data/to-json';
import { toStringArray } from 'src/logic-functions/data/to-string-array';
import { toText } from 'src/logic-functions/data/to-text';
import { type LushaRecord } from 'src/logic-functions/types/lusha-record.type';
import { type PersonRecord } from 'src/logic-functions/types/person-record.type';
import { mergeEmails } from 'src/logic-functions/utils/merge-emails';
import { mergePhones } from 'src/logic-functions/utils/merge-phones';
import {
  pickFullName,
  pickLinks,
  pickText,
} from 'src/logic-functions/utils/pick-standard-value';
import {
  readLushaContactPhones,
  readLushaEmails,
  sortLushaEmails,
} from 'src/logic-functions/utils/read-lusha-contact-points';

export const buildPersonStandardData = ({
  person,
  contact,
}: {
  person: PersonRecord;
  contact: LushaRecord;
}): Record<string, unknown> => {
  const jobTitle = toJsonObject(contact.jobTitle);
  const socialLinks = toJsonObject(contact.socialLinks);

  return pruneUndefined({
    name: pickFullName({
      currentName: person.name,
      lushaFirstName: toText(contact.firstName),
      lushaLastName: toText(contact.lastName),
    }),
    jobTitle: pickText({
      currentValue: person.jobTitle,
      lushaValue: toText(jobTitle?.title),
    }),
    linkedinLink: pickLinks({
      currentLinks: person.linkedinLink,
      lushaUrl: normalizeLinkedinUrl(socialLinks?.linkedin),
    }),
    emails: mergeEmails({
      currentEmails: person.emails,
      lushaEmails: readLushaEmails(contact),
    }),
    phones: mergePhones({
      currentPhones: person.phones,
      lushaPhones: readLushaContactPhones(contact),
    }),
  });
};

export const buildPersonLushaData = ({
  contact,
  enrichedAt,
}: {
  contact: LushaRecord;
  enrichedAt: string;
}): Record<string, unknown> => {
  const jobTitle = toJsonObject(contact.jobTitle);
  const location = toJsonObject(contact.location);
  const socialLinks = toJsonObject(contact.socialLinks);
  // Lusha sends coordinates as [longitude, latitude].
  const coordinates = toJsonArray(location?.coordinates);
  const [bestEmail] = sortLushaEmails(contact);
  const phones = (toJsonArray(contact.phones) ?? [])
    .map(toJsonObject)
    .filter(isDefined);

  return pruneUndefined({
    lushaId: toText(contact.id),
    lushaSeniority: pickSelectValue({
      raw: jobTitle?.seniority,
      allowedValues: LUSHA_SENIORITY_VALUES,
    }),
    lushaDepartments: toStringArray(jobTitle?.departments),
    lushaLocation: buildAddress({
      city: location?.city,
      state: location?.state,
      country: location?.country,
      longitude: coordinates?.[0],
      latitude: coordinates?.[1],
    }),
    lushaXLink: buildLinks(socialLinks?.xUrl),
    lushaPreviousEmployment: toJsonArray(contact.previousEmployment),
    lushaEmailConfidence: toText(bestEmail?.confidence),
    lushaDoNotCall:
      phones.length > 0
        ? phones.some((phone) => phone.doNotCall === true)
        : undefined,
    lushaIsEuContact: toBoolean(location?.isEuContact),
    lushaDataUpdatedAt: parseLushaDate(contact.updateDate),
    lushaLastEnrichedAt: enrichedAt,
    lushaEnrichmentStatus: 'ENRICHED',
    lushaRawPayload: contact,
  });
};
