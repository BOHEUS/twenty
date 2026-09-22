import { isNonEmptyString } from '@sniptt/guards';

import { matchSelectValue } from 'src/logic-functions/data/match-select-value.util';
import { sanitizeDomain } from 'src/logic-functions/utils/sanitize-domain.util';
import {
  type FullEnrichCompany,
  type FullEnrichCompanyAddress,
} from 'src/logic-functions/types/fullenrich.types';
import {
  COMPANY_TYPES,
  HEADCOUNT_RANGES,
  type TwentyAddress,
  type TwentyCompanyUpdate,
} from 'src/logic-functions/types/twenty.types';
import { isDefined } from 'src/logic-functions/utils/is-defined';

// headquarters can come back as an empty object, which must not blank out an
// address the record already holds
const buildAddress = (
  headquarters: FullEnrichCompanyAddress | undefined,
): TwentyAddress | undefined => {
  if (!isDefined(headquarters)) {
    return undefined;
  }

  const hasAnyAddressPart = [
    headquarters.line1,
    headquarters.city,
    headquarters.region,
    headquarters.country,
  ].some(isNonEmptyString);

  if (!hasAnyAddressPart) {
    return undefined;
  }

  return {
    addressStreet1: headquarters.line1 ?? '',
    // line2 is a full location string (city, region, postcode, country code),
    // not a second street line, so it is left out rather than duplicating the
    // parsed fields below
    addressStreet2: '',
    addressCity: headquarters.city ?? '',
    addressState: headquarters.region ?? '',
    // The postcode is only available inside line2, unparsed
    addressPostcode: '',
    addressCountry: headquarters.country ?? '',
  };
};

export const buildTwentyCompany = ({
  company,
  enrichedAt,
}: {
  company: FullEnrichCompany;
  enrichedAt: string;
}): TwentyCompanyUpdate => {
  const professionalNetwork = company.social_profiles?.professional_network;
  // Twenty's domainName holds a domain, so the bare one wins over the full URL
  const domainName = isNonEmptyString(company.domain)
    ? company.domain
    : sanitizeDomain(company.website);
  const address = buildAddress(company.locations?.headquarters);
  const companyType = matchSelectValue(company.company_type, COMPANY_TYPES);
  const headcountRange = matchSelectValue(
    company.headcount_range,
    HEADCOUNT_RANGES,
  );

  return {
    fullEnrichEnrichedAt: enrichedAt,
    ...(isNonEmptyString(company.name) && { name: company.name }),
    ...(isNonEmptyString(company.id) && {
      fullEnrichCompanyId: company.id,
    }),
    ...(isNonEmptyString(domainName) && {
      domainName: { primaryLinkLabel: '', primaryLinkUrl: domainName },
    }),
    ...(isNonEmptyString(professionalNetwork?.url) && {
      linkedinLink: {
        primaryLinkLabel: professionalNetwork?.handle ?? '',
        primaryLinkUrl: professionalNetwork.url,
      },
    }),
    ...(isDefined(address) && { address }),
    ...(isNonEmptyString(company.description) && {
      fullEnrichDescription: company.description,
    }),
    // year_founded and headcount are 0 when FullEnrich does not know them
    ...(!!company.year_founded && {
      fullEnrichYearFounded: company.year_founded,
    }),
    ...(!!company.headcount && { fullEnrichHeadcount: company.headcount }),
    ...(isDefined(headcountRange) && { fullEnrichHeadcountRange: headcountRange }),
    ...(isDefined(companyType) && { fullEnrichCompanyType: companyType }),
    ...(isNonEmptyString(company.industry?.main_industry) && {
      fullEnrichIndustry: company.industry.main_industry,
    }),
    ...(!!company.specialties?.length && {
      fullEnrichSpecialties: company.specialties,
    }),
    ...(isNonEmptyString(company.logo_url) && {
      fullEnrichLogo: { primaryLinkLabel: '', primaryLinkUrl: company.logo_url },
    }),
    ...(!!company.locations?.offices?.length && {
      fullEnrichOfficeLocations: company.locations.offices,
    }),
    ...(!!professionalNetwork?.connection_count && {
      fullEnrichLinkedinFollowerCount: professionalNetwork.connection_count,
    }),
  };
};
