import { EMPLOYEE_RANGE_OPTIONS } from 'src/constants/employee-range-options';
import { REVENUE_RANGE_OPTIONS } from 'src/constants/revenue-range-options';
import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildAllowedValues } from 'src/logic-functions/utils/build-allowed-values';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { pickSelect } from 'src/logic-functions/utils/pick-select';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { type ExploriumCompanyData } from 'src/types/explorium-company-data';
import { type MappedRecord } from 'src/types/mapped-record';
import { pruneUndefined } from 'src/utils/prune-undefined';

const EMPLOYEE_RANGE_VALUES = buildAllowedValues(EMPLOYEE_RANGE_OPTIONS);
const REVENUE_RANGE_VALUES = buildAllowedValues(REVENUE_RANGE_OPTIONS);

export const mapCompany = (companyData: ExploriumCompanyData): MappedRecord => {
  const standard = pruneUndefined({
    name: toText(companyData.name),
    domainName: buildLinks({ url: normalizeDomain(companyData.website) }),
    linkedinLink: buildLinks({
      url: normalizeLinkedinUrl(companyData.linkedin_profile),
    }),
    address: buildAddress({
      street1: companyData.street,
      city: companyData.city_name,
      postcode: companyData.zip_code,
      state: companyData.region_name,
      country: companyData.country_name,
    }),
  });

  const explorium = pruneUndefined({
    exploriumId: toText(companyData.business_id),
    exploriumDescription: toText(companyData.business_description),
    exploriumIndustry: toText(companyData.linkedin_industry_category),
    exploriumEmployeeRange: pickSelect({
      raw: companyData.number_of_employees_range,
      allowedValues: EMPLOYEE_RANGE_VALUES,
    }),
    exploriumRevenueRange: pickSelect({
      raw: companyData.yearly_revenue_range,
      allowedValues: REVENUE_RANGE_VALUES,
    }),
    exploriumTicker: toText(companyData.ticker),
    exploriumNaics: toText(companyData.naics),
    exploriumNaicsDescription: toText(companyData.naics_description),
    exploriumSic: toText(companyData.sic_code),
    exploriumSicDescription: toText(companyData.sic_code_description),
    exploriumLocationsDistribution: toJsonArray(
      companyData.locations_distribution,
    ),
  });

  return { standard, explorium };
};
