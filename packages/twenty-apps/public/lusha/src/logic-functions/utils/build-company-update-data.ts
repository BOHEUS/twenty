import { isDefined } from 'twenty-sdk/utils';

import { buildAddress } from 'src/logic-functions/data/build-address';
import { buildCurrency } from 'src/logic-functions/data/build-currency';
import { buildLinks } from 'src/logic-functions/data/build-links';
import { formatRevenueRange } from 'src/logic-functions/data/format-revenue-range';
import { normalizeLinkedinUrl } from 'src/logic-functions/data/normalize-linkedin-url';
import { parseLushaDate } from 'src/logic-functions/data/parse-lusha-date';
import { pruneUndefined } from 'src/logic-functions/data/prune-undefined';
import { toJsonArray, toJsonObject } from 'src/logic-functions/data/to-json';
import { toNumber } from 'src/logic-functions/data/to-number';
import { toStringArray } from 'src/logic-functions/data/to-string-array';
import { toText } from 'src/logic-functions/data/to-text';
import { type CompanyRecord } from 'src/logic-functions/types/company-record.type';
import { type LushaRecord } from 'src/logic-functions/types/lusha-record.type';
import { mergePhones } from 'src/logic-functions/utils/merge-phones';
import {
  pickLinks,
  pickText,
} from 'src/logic-functions/utils/pick-standard-value';
import { readLushaCompanyPhones } from 'src/logic-functions/utils/read-lusha-contact-points';

const isEmptyAddress = (address: CompanyRecord['address']): boolean =>
  [
    address?.addressStreet1,
    address?.addressStreet2,
    address?.addressCity,
    address?.addressState,
    address?.addressPostcode,
    address?.addressCountry,
  ].every((part) => !isDefined(toText(part)));

const formatIndustryCodes = (value: unknown): string[] | undefined =>
  toStringArray(
    (toJsonArray(value) ?? []).map((industryCode) => {
      const industryCodeObject = toJsonObject(industryCode);
      const code =
        toNumber(industryCodeObject?.code) ?? toText(industryCodeObject?.code);
      const description = toText(industryCodeObject?.description);

      if (!isDefined(code)) {
        return undefined;
      }

      return isDefined(description) ? `${code} - ${description}` : `${code}`;
    }),
  );

// Lusha's examples list technologies as names, while its data catalog
// describes objects, so both shapes are read.
const readTechnologyNames = (value: unknown): string[] | undefined =>
  toStringArray(
    (toJsonArray(value) ?? []).map(
      (technology) =>
        toText(technology) ?? toText(toJsonObject(technology)?.name),
    ),
  );

export const buildCompanyStandardData = ({
  company,
  lushaCompany,
}: {
  company: CompanyRecord;
  lushaCompany: LushaRecord;
}): Record<string, unknown> => {
  const socialLinks = toJsonObject(lushaCompany.socialLinks);
  const location = toJsonObject(lushaCompany.location);

  return pruneUndefined({
    name: pickText({
      currentValue: company.name,
      lushaValue: toText(lushaCompany.name),
    }),
    linkedinLink: pickLinks({
      currentLinks: company.linkedinLink,
      lushaUrl: normalizeLinkedinUrl(socialLinks?.linkedin),
    }),
    // Lusha knows no street, so its location only fills an empty address
    // rather than being mixed into one.
    address: isEmptyAddress(company.address)
      ? buildAddress({
          city: location?.city,
          state: location?.state,
          postcode: location?.zipCode,
          country: location?.country,
        })
      : undefined,
  });
};

export const buildCompanyLushaData = ({
  lushaCompany,
  enrichedAt,
}: {
  lushaCompany: LushaRecord;
  enrichedAt: string;
}): Record<string, unknown> => {
  const funding = toJsonObject(lushaCompany.funding);
  const socialLinks = toJsonObject(lushaCompany.socialLinks);
  const location = toJsonObject(lushaCompany.location);

  return pruneUndefined({
    lushaId: toText(lushaCompany.id),
    lushaDescription: toText(lushaCompany.description),
    lushaIndustry: toText(lushaCompany.industry),
    lushaSubIndustry: toText(lushaCompany.subIndustry),
    lushaEmployeeCount: toNumber(
      toJsonObject(lushaCompany.employeeCount)?.exact,
    ),
    lushaRevenueRange: formatRevenueRange(lushaCompany.revenueRange),
    lushaFoundedYear: toNumber(lushaCompany.yearFounded),
    lushaCompanyType: toText(lushaCompany.companyType),
    lushaSpecialities: toStringArray(lushaCompany.specialities),
    lushaTechnologies: readTechnologyNames(lushaCompany.technologies),
    lushaSicCodes: formatIndustryCodes(lushaCompany.sicCodes),
    lushaNaicsCodes: formatIndustryCodes(lushaCompany.naicsCodes),
    lushaTotalFunding: buildCurrency({
      amount: funding?.totalRoundsAmount,
      currencyCode: funding?.currency,
    }),
    lushaLastFundingType: toText(funding?.lastRoundType),
    lushaLastFundingDate: parseLushaDate(funding?.lastRoundDate),
    lushaLinkedinFollowers: toNumber(lushaCompany.linkedinFollowers),
    lushaXLink: buildLinks(socialLinks?.x),
    lushaFacebookLink: buildLinks(socialLinks?.facebook),
    lushaPhones: mergePhones({
      currentPhones: null,
      lushaPhones: readLushaCompanyPhones(lushaCompany),
    }),
    lushaLocation: buildAddress({
      city: location?.city,
      state: location?.state,
      postcode: location?.zipCode,
      country: location?.country,
    }),
    lushaLastEnrichedAt: enrichedAt,
    lushaEnrichmentStatus: 'ENRICHED',
    lushaRawPayload: lushaCompany,
  });
};
