import { type ApolloRecord } from 'src/logic-functions/types/apollo-record.type';
import { toJsonArray, toJsonObject } from "../data/to-json";
import { isDefined } from "../data/is-defined";
import { toText } from "src/logic-functions/data/to-text";
import { pruneUndefined } from "src/logic-functions/data/prune-undefined";
import { toNumber } from "src/logic-functions/data/to-number";
import { buildLinks } from "src/logic-functions/data/build-links";
import { buildCurrencyFromUsd } from "src/logic-functions/data/build-currency-from-usd";
import { buildAddress } from "src/logic-functions/data/build-address";
import { toStringArray } from "src/logic-functions/data/to-string-array";

const buildPhones = (organization: ApolloRecord) => {
  const primaryPhone = toJsonObject(organization.primary_phone);
  const number =
    toText(organization.phone) ??
    toText(primaryPhone?.sanitized_number) ??
    toText(primaryPhone?.number);

  return isDefined(number) ? { primaryPhoneNumber: number } : undefined;
};

const buildCorporateHierarchy = (organization: ApolloRecord) => {
  const hierarchy = pruneUndefined({
    ownedByOrganizationId: toText(organization.owned_by_organization_id),
    ownedByOrganization: toJsonObject(organization.owned_by_organization),
    ownedByChain: toJsonArray(organization.owned_by_chain),
    ultimateParentOrganization: toJsonObject(
      organization.ultimate_parent_organization,
    ),
    suborganizations: toJsonArray(organization.suborganizations),
    numSuborganizations: toNumber(organization.num_suborganizations),
  });

  return Object.keys(hierarchy).length > 0 ? hierarchy : undefined;
};

// Fields Apollo returns that the standard Company object already holds. The
// standard object has no industry, description, employee-count, phone or
// social field beyond LinkedIn, which is what the apollo* fields carry.
export const buildCompanyStandardData = (
  organization: ApolloRecord,
): Record<string, unknown> =>
  pruneUndefined({
    name: toText(organization.name),
    domainName: buildLinks(
      toText(organization.website_url) ?? toText(organization.primary_domain),
      'Website',
    ),
    linkedinLink: buildLinks(organization.linkedin_url, 'LinkedIn'),
    annualRevenue: buildCurrencyFromUsd(organization.annual_revenue),
    address: buildAddress({
      street: organization.street_address,
      city: organization.city,
      state: organization.state,
      postcode: organization.postal_code,
      country: organization.country,
    }),
  });

export const buildCompanyApolloData = ({
                                         organization,
                                         enrichedAt,
                                       }: {
  organization: ApolloRecord;
  enrichedAt: string;
}): Record<string, unknown> =>
  pruneUndefined({
    apolloOrganizationId: toText(organization.id),
    apolloIndustry: toText(organization.industry),
    apolloSecondaryIndustries:
      toStringArray(organization.secondary_industries) ??
      toStringArray(organization.industries),
    apolloKeywords: toStringArray(organization.keywords),
    apolloShortDescription: toText(organization.short_description),
    apolloSeoDescription: toText(organization.seo_description),
    apolloFoundedYear: toNumber(organization.founded_year),
    apolloTotalFunding: buildCurrencyFromUsd(organization.total_funding),
    apolloLatestFundingStage: toText(organization.latest_funding_stage),
    apolloLatestFundingRoundDate: toText(
      organization.latest_funding_round_date,
    ),
    apolloFundingEvents: toJsonArray(organization.funding_events),
    apolloEstimatedNumEmployees: toNumber(organization.estimated_num_employees),
    apolloDepartmentalHeadCount: toJsonObject(
      organization.departmental_head_count,
    ),
    apolloHeadcountGrowthSixMonths: toNumber(
      organization.organization_headcount_six_month_growth,
    ),
    apolloHeadcountGrowthTwelveMonths: toNumber(
      organization.organization_headcount_twelve_month_growth,
    ),
    apolloHeadcountGrowthTwentyFourMonths: toNumber(
      organization.organization_headcount_twenty_four_month_growth,
    ),
    apolloXLink: buildLinks(organization.twitter_url, 'X'),
    apolloFacebookLink: buildLinks(organization.facebook_url, 'Facebook'),
    apolloCrunchbaseLink: buildLinks(organization.crunchbase_url, 'Crunchbase'),
    apolloAngellistLink: buildLinks(organization.angellist_url, 'AngelList'),
    apolloBlogLink: buildLinks(organization.blog_url, 'Blog'),
    apolloLogoLink: buildLinks(organization.logo_url, 'Logo'),
    apolloPhones: buildPhones(organization),
    apolloPubliclyTradedSymbol: toText(organization.publicly_traded_symbol),
    apolloPubliclyTradedExchange: toText(organization.publicly_traded_exchange),
    apolloLinkedinUid: toText(organization.linkedin_uid),
    apolloAlexaRanking: toNumber(organization.alexa_ranking),
    apolloLanguages: toStringArray(organization.languages),
    apolloTechnologyNames: toStringArray(organization.technology_names),
    apolloCurrentTechnologies: toJsonArray(organization.current_technologies),
    apolloRetailLocationCount:
      toNumber(organization.num_retail_locations) ??
      toNumber(organization.retail_location_count),
    apolloCorporateHierarchy: buildCorporateHierarchy(organization),
    apolloAccountId: toText(organization.account_id),
    apolloLastEnrichedAt: enrichedAt,
    apolloEnrichmentStatus: 'ENRICHED',
    apolloRawPayload: organization,
  });
