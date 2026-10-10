import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toJsonObject } from 'src/logic-functions/utils/to-json-object';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { toStringArray } from 'src/logic-functions/utils/to-string-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { type AmplemarketCompany } from 'src/types/amplemarket-company';
import { type MappedRecord } from 'src/types/mapped-record';
import { pruneUndefined } from 'src/utils/prune-undefined';

const toCodeList = (codes: unknown): string[] | undefined =>
  toStringArray(Array.isArray(codes) ? codes.map(String) : undefined);

export const mapCompany = (company: AmplemarketCompany): MappedRecord => {
  const locations = company.locations ?? [];
  const primaryLocation =
    locations.find((location) => location.is_primary === true) ?? locations[0];

  const standard = pruneUndefined({
    name: toText(company.name),
    domainName: buildLinks({ url: normalizeDomain(company.website) }),
    linkedinLink: buildLinks({
      url: normalizeLinkedinUrl(company.linkedin_url),
    }),
    // The street only exists inside the one-line address, so it is left out
    // rather than duplicating the city and country into the street
    address: buildAddress({
      city: primaryLocation?.city,
      postcode: primaryLocation?.postal_code,
      state: primaryLocation?.state,
      country: primaryLocation?.country,
    }),
  });

  const amplemarket = pruneUndefined({
    amplemarketId: toText(company.id),
    amplemarketOverview: toText(company.overview),
    amplemarketIndustry: toText(company.industry),
    amplemarketType: toText(company.type),
    amplemarketSize: toText(company.size),
    amplemarketEmployeeCount: toNumber(company.estimated_number_of_employees),
    amplemarketFoundedYear: toNumber(company.founded_year),
    amplemarketKeywords: toStringArray(company.keywords),
    amplemarketIsB2b: company.is_b2b ?? undefined,
    amplemarketIsB2c: company.is_b2c ?? undefined,
    amplemarketSicCodes: toCodeList(company.sic_codes),
    amplemarketNaicsCodes: toCodeList(company.naics_codes),
    amplemarketEstimatedRevenue: toText(company.estimated_revenue),
    // Amplemarket documents no unit or currency for these, so they are kept
    // as plain numbers instead of currency fields
    amplemarketRevenue: toNumber(company.revenue),
    amplemarketTotalFunding: toNumber(company.total_funding),
    amplemarketLatestFundingStage: toText(company.latest_funding_stage),
    amplemarketLatestFundingDate: toText(company.latest_funding_date)?.slice(
      0,
      10,
    ),
    amplemarketFundingEvents: toJsonArray(company.funding_events),
    amplemarketTechnologies: toStringArray(company.technologies),
    amplemarketDepartmentHeadcount: toJsonObject(company.department_headcount),
    amplemarketJobFunctionHeadcount: toJsonObject(
      company.job_function_headcount,
    ),
    amplemarketTrafficRank: toNumber(company.traffic_rank),
    amplemarketFollowers: toNumber(company.followers),
    amplemarketLocations: toJsonArray(company.locations),
  });

  return { standard, amplemarket };
};
