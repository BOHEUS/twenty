import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildCurrencyFromUsd } from 'src/logic-functions/utils/build-currency-from-usd';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { buildPhones } from 'src/logic-functions/utils/build-phones';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toJsonObject } from 'src/logic-functions/utils/to-json-object';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { toStringArray } from 'src/logic-functions/utils/to-string-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { type MappedRecord } from 'src/types/mapped-record';
import { type RocketReachCompanyData } from 'src/types/rocketreach-company-data';
import { isDefined } from 'src/logic-functions/utils/is-defined';
import { pruneUndefined } from 'src/logic-functions/utils/prune-undefined';

export const mapCompany = (
  companyData: RocketReachCompanyData,
): MappedRecord => {
  const companyId = toNumber(companyData.id);
  const links = toJsonObject(companyData.links) ?? {};

  const standard = pruneUndefined({
    name: toText(companyData.name),
    domainName: buildLinks({
      url:
        normalizeDomain(companyData.domain) ??
        normalizeDomain(companyData.website_domain),
    }),
    linkedinLink: buildLinks({ url: links.linkedin }),
    annualRevenue: buildCurrencyFromUsd(companyData.revenue),
    address: buildAddress({
      street1: companyData.address?.street,
      city: companyData.address?.city,
      state: companyData.address?.region,
      postcode: companyData.address?.postal_code,
      country: companyData.address?.country,
    }),
  });

  const rocketReach = pruneUndefined({
    rocketReachId: isDefined(companyId) ? String(companyId) : undefined,
    rocketReachProfileLink: buildLinks({ url: companyData.rr_profile_url }),

    rocketReachDescription: toText(companyData.description),
    rocketReachIndustry: toText(companyData.industry),
    rocketReachIndustries: toStringArray(companyData.industries),
    rocketReachIndustryKeywords: toStringArray(companyData.industry_keywords),

    rocketReachEmployeeCount: toNumber(companyData.num_employees),
    rocketReachFoundedYear: toNumber(companyData.year_founded),
    rocketReachEmailDomain: toText(companyData.email_domain),

    rocketReachDepartmentHeadcount: toJsonObject(companyData.departments),
    rocketReachSicCodes: toStringArray(companyData.sic_codes),
    rocketReachNaicsCodes: toStringArray(companyData.naics_codes),

    rocketReachPhone: buildPhones([{ number: companyData.phone }]),
    rocketReachFax: toText(companyData.fax),

    rocketReachTickerSymbol: toText(companyData.ticker_symbol),
    rocketReachFundingInvestors: toStringArray(companyData.funding_investors),
    rocketReachTechstack: toStringArray(companyData.techstack),
    rocketReachCompanyGrowth: toJsonArray(companyData.company_growth),
    rocketReachCompetitors: toStringArray(companyData.competitors),

    rocketReachTwitterLink: buildLinks({ url: links.twitter }),
    rocketReachFacebookLink: buildLinks({ url: links.facebook }),
  });

  return { standard, rocketReach };
};
