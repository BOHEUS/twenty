import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildEmails } from 'src/logic-functions/utils/build-emails';
import { buildFullName } from 'src/logic-functions/utils/build-full-name';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { buildPhones } from 'src/logic-functions/utils/build-phones';
import { pickLinkedinUrl } from 'src/logic-functions/utils/pick-linkedin-url';
import { readObjectProperty } from 'src/logic-functions/utils/read-object-property';
import { toBoolean } from 'src/logic-functions/utils/to-boolean';
import { toIdentifierText } from 'src/logic-functions/utils/to-identifier-text';
import { toIsoDateTime } from 'src/logic-functions/utils/to-iso-date-time';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toNumberLike } from 'src/logic-functions/utils/to-number-like';
import { toStringArray } from 'src/logic-functions/utils/to-string-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { toStringValues } from 'src/logic-functions/utils/to-string-values';
import { type MappedRecord } from 'src/types/mapped-record';
import { type ZoomInfoContactData } from 'src/types/zoominfo-contact-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const mapContact = (contactData: ZoomInfoContactData): MappedRecord => {
  const company = contactData.company ?? {};

  const standard = pruneUndefined({
    name: buildFullName({
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      fullName: undefined,
    }),
    emails: buildEmails([
      ...toStringValues(contactData.email),
      ...toStringValues(contactData.emailAlt),
      ...toStringValues(contactData.supplementalEmail),
    ]),
    phones: buildPhones([
      ...toStringValues(contactData.phone),
      ...toStringValues(contactData.mobilePhone),
      ...toStringValues(contactData.directPhoneAlt),
      ...toStringValues(contactData.mobilePhoneAlt),
    ]),
    jobTitle: toText(contactData.jobTitle),
    linkedinLink: buildLinks({
      url: pickLinkedinUrl(contactData.externalUrls),
    }),
  });

  const zoomInfo = pruneUndefined({
    zoomInfoContactId: toIdentifierText(contactData.id),
    zoomInfoCompanyId: toIdentifierText(company.id),

    zoomInfoContactAccuracyScore: toNumberLike(
      contactData.contactAccuracyScore,
    ),
    zoomInfoYearsOfExperience: toNumberLike(contactData.yearsOfExperience),

    zoomInfoJobFunction: readObjectProperty({
      value: contactData.jobFunction,
      property: 'name',
    }),
    zoomInfoJobDepartment: readObjectProperty({
      value: contactData.jobFunction,
      property: 'department',
    }),
    zoomInfoManagementLevel: toStringArray(contactData.managementLevel),
    zoomInfoMetroArea: toText(contactData.metroArea),
    zoomInfoPersonHasMoved: toText(contactData.personHasMoved),

    zoomInfoWithinEu: toBoolean(contactData.withinEu),
    zoomInfoWithinCalifornia: toBoolean(contactData.withinCalifornia),
    zoomInfoWithinCanada: toBoolean(contactData.withinCanada),

    zoomInfoPositionStartDate: toIsoDateTime(contactData.positionStartDate),
    zoomInfoValidDate: toIsoDateTime(contactData.validDate),
    zoomInfoLastUpdatedDate: toIsoDateTime(contactData.lastUpdatedDate),

    zoomInfoTechSkills: toJsonArray(contactData.techSkills),
    zoomInfoEducation: toJsonArray(contactData.education),
    zoomInfoEmploymentHistory: toJsonArray(contactData.employmentHistory),
    zoomInfoExternalUrls: toJsonArray(contactData.externalUrls),

    zoomInfoLocation: buildAddress({
      street1: contactData.street,
      city: contactData.city,
      postcode: contactData.zipCode,
      state: contactData.state,
      country: contactData.country,
    }),
  });

  return { standard, zoomInfo };
};
