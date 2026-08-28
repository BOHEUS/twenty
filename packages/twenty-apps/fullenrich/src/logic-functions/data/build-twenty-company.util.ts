import {
  fullEnrichTwentyCompany,
  HEAD_COUNT_RANGES,
  Profile,
  TWENTY_COMPANY_TYPES,
} from "src/logic-functions/shared/types";
import { matchSelectValue } from "src/logic-functions/data/match-select-value.util";

export const buildTwentyCompany = (
  profile: Profile,
  enrichedAt: string,
): fullEnrichTwentyCompany | null => {
  const company = profile.employment?.current?.company;
  if (!company) {
    return null;
  }
  const headquarters = company.locations?.headquarters;
  const offices = company.locations?.offices;
  const professionalNetwork = company.social_profiles?.professional_network;
  // Twenty's domainName is a domain field, so the bare domain wins over the full URL
  const domainName = company.domain ?? company.website;
  const companyType = matchSelectValue(company.company_type, TWENTY_COMPANY_TYPES);
  const headcountRange = matchSelectValue(company.headcount_range, HEAD_COUNT_RANGES);

  return {
    name: company.name,
    fullEnrichCompanyId: company.id,
    enrichedAt,
    ...(domainName && {
      domainName: { primaryLinkLabel: '', primaryLinkUrl: domainName },
    }),
    ...(professionalNetwork?.url && {
      linkedinLink: {
        primaryLinkLabel: professionalNetwork.handle ?? '',
        primaryLinkUrl: professionalNetwork.url,
      },
    }),
    ...(headquarters && {
      address: {
        addressStreet1: headquarters.line1 ?? '',
        addressStreet2: headquarters.line2 ?? '',
        addressCity: headquarters.city ?? '',
        addressCountry: headquarters.country ?? '',
        addressState: headquarters.region ?? '',
        // FullEnrich never returns a postal code
        addressZipCode: '',
      },
    }),
    ...(company.description && { description: company.description }),
    ...(company.year_founded && { yearFounded: company.year_founded }),
    // headcount can be 0 even when a range is available, so only a positive count is written
    ...(company.headcount && { headcount: company.headcount }),
    ...(headcountRange && { headcountRange }),
    ...(companyType && { companyType }),
    ...(company.industry?.main_industry && {
      industry: company.industry.main_industry,
    }),
    ...(company.specialties?.length && { specialties: company.specialties }),
    ...(company.logo_url && {
      logo: { primaryLinkLabel: '', primaryLinkUrl: company.logo_url },
    }),
    ...(offices?.length && { officeLocations: offices }),
    ...(professionalNetwork?.connection_count && {
      linkedinFollowerCount: professionalNetwork.connection_count,
    }),
  };
};
