import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildCurrencyFromUsd } from 'src/logic-functions/utils/build-currency-from-usd';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { buildPhones } from 'src/logic-functions/utils/build-phones';
import { buildSocialLink } from 'src/logic-functions/utils/build-social-link';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { toStringArray } from 'src/logic-functions/utils/to-string-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { type HunterCompany } from 'src/types/hunter-company';
import { type MappedRecord } from 'src/types/mapped-record';
import { pruneUndefined } from 'src/utils/prune-undefined';

const CRUNCHBASE_ORGANIZATION_PREFIX_REGEX = /^organization\//;

export const mapCompany = (company: HunterCompany): MappedRecord => {
  const { geo, metrics, category } = company;
  const crunchbaseHandle = toText(company.crunchbase?.handle)?.replace(
    CRUNCHBASE_ORGANIZATION_PREFIX_REGEX,
    '',
  );

  const standard = pruneUndefined({
    name: toText(company.name),
    domainName: buildLinks({ url: normalizeDomain(company.domain) }),
    linkedinLink: buildSocialLink({
      baseUrl: 'linkedin.com',
      handle: company.linkedin?.handle,
    }),
    address: buildAddress({
      street1: geo?.streetAddress,
      city: geo?.city,
      postcode: geo?.postalCode,
      state: geo?.state,
      country: geo?.country,
      geo:
        toNumber(geo?.lat) !== undefined && toNumber(geo?.lng) !== undefined
          ? `${geo?.lat},${geo?.lng}`
          : undefined,
    }),
    // Hunter's exact revenue is optional; the estimate is only a range
    annualRevenue: buildCurrencyFromUsd(metrics?.annualRevenue),
  });

  const hunter = pruneUndefined({
    hunterId: toText(company.id),
    hunterLegalName: toText(company.legalName),
    hunterDescription: toText(company.description),
    hunterSector: toText(category?.sector),
    hunterIndustry: toText(category?.industry),
    hunterSicCode: toText(category?.sicCode),
    hunterNaicsCode: toText(category?.naicsCode),
    hunterGicsCode: toText(category?.gicsCode),
    hunterTags: toStringArray(company.tags),
    hunterType: toText(company.type),
    hunterFoundedYear: toNumber(company.foundedYear),
    hunterEmployeeRange: toText(metrics?.employees),
    hunterEmployeeCount: toNumber(metrics?.employeesCount),
    hunterEstimatedRevenue: toText(metrics?.estimatedAnnualRevenue),
    hunterTotalFunding: buildCurrencyFromUsd(metrics?.raised),
    hunterMarketCap: buildCurrencyFromUsd(metrics?.marketCap),
    hunterTrafficRank: toText(metrics?.trafficRank),
    hunterTicker: toText(company.ticker),
    hunterPhone: buildPhones([company.phone]),
    hunterTimeZone: toText(company.timeZone),
    hunterDomainAliases: toStringArray(company.domainAliases),
    hunterTech: toStringArray(company.tech),
    hunterTechCategories: toStringArray(company.techCategories),
    hunterFundingRounds: toJsonArray(company.fundingRounds),
    hunterXLink: buildSocialLink({
      baseUrl: 'https://x.com',
      handle: company.twitter?.handle,
    }),
    hunterFacebookLink: buildSocialLink({
      baseUrl: 'https://www.facebook.com',
      handle: company.facebook?.handle,
    }),
    hunterCrunchbaseLink: buildSocialLink({
      baseUrl: 'https://www.crunchbase.com/organization',
      handle: crunchbaseHandle,
    }),
    hunterInstagramLink: buildSocialLink({
      baseUrl: 'https://www.instagram.com',
      handle: company.instagram?.handle,
    }),
    hunterParentDomain: toText(company.parent?.domain),
    hunterUltimateParentDomain: toText(company.ultimateParent?.domain),
  });

  return { standard, hunter };
};
