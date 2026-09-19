import { isObject } from '@sniptt/guards';

import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildCurrencyFromUsd } from 'src/logic-functions/utils/build-currency-from-usd';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { parsePartialDate } from 'src/logic-functions/utils/parse-partial-date';
import { toIdText } from 'src/logic-functions/utils/to-id-text';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toJsonObject } from 'src/logic-functions/utils/to-json-object';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { toStringArray } from 'src/logic-functions/utils/to-string-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CrustdataCompanyData } from 'src/types/crustdata-company-data';
import { type MappedRecord } from 'src/types/mapped-record';
import { isDefined } from 'src/utils/is-defined';
import { pruneUndefined } from 'src/utils/prune-undefined';

type NestedRating = { rating?: unknown };

const isNestedRating = (value: unknown): value is NestedRating =>
  isObject(value);

const toRating = (rawRating: unknown): number | undefined =>
  isNestedRating(rawRating) ? toNumber(rawRating.rating) : toNumber(rawRating);

const buildAcquisitions = (
  funding: CrustdataCompanyData['funding'],
): Record<string, unknown> | undefined => {
  const acquisitions = pruneUndefined({
    acquisitions: isDefined(funding?.acquisitions)
      ? funding.acquisitions
      : undefined,
    acquiredBy: isDefined(funding?.acquired_by) ? funding.acquired_by : undefined,
  });

  return Object.keys(acquisitions).length > 0 ? acquisitions : undefined;
};

const buildHeadcountBreakdown = (
  headcount: CrustdataCompanyData['headcount'],
): Record<string, unknown> | undefined => {
  const breakdown = pruneUndefined({
    byRole: toJsonObject(headcount?.by_role_absolute),
    byRegion: toJsonObject(headcount?.by_region_absolute),
  });

  return Object.keys(breakdown).length > 0 ? breakdown : undefined;
};

const buildKeyPeople = (
  people: CrustdataCompanyData['people'],
): Record<string, unknown> | undefined => {
  const keyPeople = pruneUndefined({
    founders: toJsonArray(people?.founders),
    cxos: toJsonArray(people?.cxos),
    decisionMakers: toJsonArray(people?.decision_makers),
  });

  return Object.keys(keyPeople).length > 0 ? keyPeople : undefined;
};

export const mapCompany = (
  companyData: CrustdataCompanyData,
): MappedRecord => {
  const basicInfo = companyData.basic_info;
  const taxonomy = companyData.taxonomy;
  const locations = companyData.locations;
  const funding = companyData.funding;
  const revenue = companyData.revenue;

  const standard = pruneUndefined({
    name: toText(basicInfo?.name),
    domainName: buildLinks({
      url: toText(basicInfo?.primary_domain) ?? toText(basicInfo?.website),
    }),
    linkedinLink: buildLinks({ url: basicInfo?.professional_network_url }),
    // Crustdata returns the headquarters as one free-text line with no separate city or postcode,
    // so it goes in street1 rather than being split on a guess.
    address: buildAddress({
      street1:
        toText(locations?.street_address) ?? toText(locations?.headquarters),
      state: locations?.state,
      country: locations?.country,
    }),
  });

  const crustdata = pruneUndefined({
    crustdataCompanyId: toIdText(companyData.crustdata_company_id),
    crustdataLinkedinId: toIdText(basicInfo?.professional_network_id),

    crustdataDescription: toText(basicInfo?.description),
    crustdataCompanyType: toText(basicInfo?.company_type),
    crustdataStatus: toText(basicInfo?.status),
    crustdataFoundedYear: toNumber(Number(basicInfo?.year_founded)),
    crustdataEmployeeCountRange: toText(basicInfo?.employee_count_range),
    crustdataEmployeeCount: toNumber(companyData.headcount?.total),

    crustdataIndustries:
      toStringArray(basicInfo?.industries) ??
      toStringArray(taxonomy?.professional_network_industries),
    crustdataMarkets: toStringArray(basicInfo?.markets),
    crustdataAllDomains: toStringArray(basicInfo?.all_domains),
    crustdataSpecialities: toStringArray(
      taxonomy?.professional_network_specialities,
    ),
    crustdataCategories: toStringArray(taxonomy?.categories),
    crustdataOfficeAddresses: toJsonArray(locations?.all_office_addresses),

    crustdataNaics: toJsonObject(taxonomy?.primary_naics_detail),
    crustdataSic: toJsonArray(taxonomy?.sic_detail_list),

    crustdataRevenueLowerBound: buildCurrencyFromUsd(
      revenue?.estimated?.lower_bound_usd,
    ),
    crustdataRevenueUpperBound: buildCurrencyFromUsd(
      revenue?.estimated?.upper_bound_usd,
    ),
    crustdataTickers: toStringArray(revenue?.public_markets?.stock_symbols),
    crustdataIpoDate: parsePartialDate(revenue?.public_markets?.ipo_date),
    crustdataAcquisitionStatus: toText(revenue?.acquisition_status),

    crustdataTotalFunding: buildCurrencyFromUsd(funding?.total_investment_usd),
    crustdataLastRoundType: toText(funding?.last_round_type),
    crustdataLastRoundAmount: buildCurrencyFromUsd(
      funding?.last_round_amount_usd,
    ),
    crustdataLastFundraiseDate: parsePartialDate(funding?.last_fundraise_date),
    crustdataInvestors: toStringArray(funding?.investors),
    crustdataAcquisitions: buildAcquisitions(funding),

    crustdataHeadcountGrowth: toJsonObject(companyData.headcount?.growth_percent),
    crustdataHeadcountBreakdown: buildHeadcountBreakdown(companyData.headcount),

    crustdataOpeningsCount: toNumber(companyData.hiring?.openings_count),
    crustdataOpeningsGrowth: toNumber(
      companyData.hiring?.openings_growth_percent,
    ),
    crustdataRecentOpenings: toJsonArray(companyData.hiring?.recent_openings),

    crustdataWebTraffic: toJsonObject(companyData.web_traffic),
    crustdataSeo: toJsonObject(companyData.seo),
    crustdataCompetitors: toJsonObject(companyData.competitors),

    crustdataEmployeeRating: toRating(
      companyData.employee_reviews?.overall_rating,
    ),
    crustdataSoftwareRating: toNumber(
      companyData.software_reviews?.average_rating,
    ),

    crustdataKeyPeople: buildKeyPeople(companyData.people),

    crustdataXLink: buildLinks({
      url: companyData.social_profiles?.twitter_url,
    }),
    crustdataCrunchbaseLink: buildLinks({
      url: companyData.social_profiles?.crunchbase?.url,
    }),
    crustdataFollowers: toNumber(companyData.followers?.count),
    crustdataNews: toJsonArray(companyData.news),
  });

  return { standard, crustdata };
};
