import { COMPANY_STATUS_OPTIONS } from 'src/constants/company-status-options';
import { COMPANY_TYPE_OPTIONS } from 'src/constants/company-type-options';
import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildAllowedValues } from 'src/logic-functions/utils/build-allowed-values';
import { buildCurrencyFromThousandsUsd } from 'src/logic-functions/utils/build-currency-from-thousands-usd';
import { buildCurrencyFromUsd } from 'src/logic-functions/utils/build-currency-from-usd';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { pickLinkedinUrl } from 'src/logic-functions/utils/pick-linkedin-url';
import { pickSelect } from 'src/logic-functions/utils/pick-select';
import { toBoolean } from 'src/logic-functions/utils/to-boolean';
import { toIdentifierText } from 'src/logic-functions/utils/to-identifier-text';
import { toIsoDateTime } from 'src/logic-functions/utils/to-iso-date-time';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toJsonObject } from 'src/logic-functions/utils/to-json-object';
import { toNumberLike } from 'src/logic-functions/utils/to-number-like';
import { toStringArray } from 'src/logic-functions/utils/to-string-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { type MappedRecord } from 'src/types/mapped-record';
import { type ZoomInfoCompanyData } from 'src/types/zoominfo-company-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

const COMPANY_TYPE_VALUES = buildAllowedValues(COMPANY_TYPE_OPTIONS);
const COMPANY_STATUS_VALUES = buildAllowedValues(COMPANY_STATUS_OPTIONS);

const toIndustryArray = (value: unknown): string[] | undefined =>
  toStringArray(Array.isArray(value) ? value : [value]);

export const mapCompany = (companyData: ZoomInfoCompanyData): MappedRecord => {
  const standard = pruneUndefined({
    name: toText(companyData.name),
    domainName: buildLinks({ url: normalizeDomain(companyData.website) }),
    linkedinLink: buildLinks({
      url: pickLinkedinUrl(companyData.socialMediaUrls),
    }),
    address: buildAddress({
      street1: companyData.street,
      city: companyData.city,
      postcode: companyData.zipCode,
      state: companyData.state,
      country: companyData.country,
    }),
    annualRevenue: buildCurrencyFromThousandsUsd(companyData.revenue),
  });

  const zoomInfo = pruneUndefined({
    zoomInfoCompanyId: toIdentifierText(companyData.id),

    zoomInfoEmployeeCount: toNumberLike(companyData.employeeCount),
    zoomInfoEmployeeRange: toText(companyData.employeeRange),
    zoomInfoRevenueRange: toText(companyData.revenueRange),
    zoomInfoLocationCount: toNumberLike(companyData.locationCount),
    zoomInfoContactCount: toNumberLike(companyData.numberOfContactsInZoomInfo),
    zoomInfoFoundedYear: toNumberLike(companyData.foundedYear),

    zoomInfoPrimaryIndustry: toIndustryArray(companyData.primaryIndustry),
    zoomInfoIndustries: toStringArray(companyData.industries),
    zoomInfoSicCodes: toJsonArray(companyData.sicCodes),
    zoomInfoNaicsCodes: toJsonArray(companyData.naicsCodes),

    zoomInfoCompanyType: pickSelect({
      raw: companyData.type,
      allowedValues: COMPANY_TYPE_VALUES,
    }),
    zoomInfoCompanyStatus: pickSelect({
      raw: companyData.companyStatus,
      allowedValues: COMPANY_STATUS_VALUES,
    }),
    zoomInfoIsDefunct: toBoolean(companyData.isDefunct),

    zoomInfoTicker: toText(companyData.ticker),
    zoomInfoDescription: toText(companyData.description),
    zoomInfoMetroArea: toText(companyData.metroArea),
    zoomInfoContinent: toText(companyData.continent),

    zoomInfoTotalFunding: buildCurrencyFromUsd(companyData.totalFundingAmount),
    zoomInfoRecentFundingAmount: buildCurrencyFromUsd(
      companyData.recentFundingAmount,
    ),
    zoomInfoRecentFundingDate: toIsoDateTime(companyData.recentFundingDate),

    zoomInfoParentName: toText(companyData.parentName),
    zoomInfoUltimateParentId: toIdentifierText(companyData.ultimateParentId),
    zoomInfoUltimateParentName: toText(companyData.ultimateParentName),

    zoomInfoCompetitors: toJsonArray(companyData.competitors),
    zoomInfoEmployeeGrowth: toJsonObject(companyData.employeeGrowth),
    zoomInfoEmployeeCountByDepartment: toJsonObject(
      companyData.employeeCountByDepartment,
    ),
  });

  return { standard, zoomInfo };
};
