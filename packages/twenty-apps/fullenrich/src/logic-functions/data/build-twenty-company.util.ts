import { fullEnrichTwentyCompany, Profile } from "src/logic-functions/shared/types";

export const buildTwentyCompany = (profile: Profile): fullEnrichTwentyCompany | null => {
  const company = profile.employment?.current?.company;
  if (!company) {
    return null;
  }
  const headquarters = company.locations?.headquarters;
  return {
    name: company.name,
    domainName: {
      primaryLinkUrl: company.website ?? '',
      primaryLinkLabel: '',
    },
    employees: company.headcount ?? null,
    linkedinLink: {
      primaryLinkLabel: '',
      primaryLinkUrl: company.social_profiles?.professional_network?.url ?? '',
    },
    address: {
      addressStreet1: headquarters?.line1 ?? '',
      addressStreet2: headquarters?.line2 ?? '',
      addressCity: headquarters?.city ?? '',
      addressCountry: headquarters?.country ?? '',
      addressPostCode: '',
      addressState: headquarters?.region ?? '',
    },
  };
};