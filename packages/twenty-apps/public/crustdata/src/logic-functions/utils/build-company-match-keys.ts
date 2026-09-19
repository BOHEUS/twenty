import { currentEmployment } from 'src/logic-functions/utils/current-employment';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { toIdText } from 'src/logic-functions/utils/to-id-text';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CompanyMatchKeys } from 'src/types/company-match-keys';
import { type CrustdataPersonData } from 'src/types/crustdata-person-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const buildCompanyMatchKeys = (
  personData: CrustdataPersonData,
): CompanyMatchKeys => {
  const currentRole = currentEmployment(personData);

  return pruneUndefined({
    crustdataId: toIdText(currentRole?.crustdata_company_id),
    website:
      normalizeDomain(currentRole?.company_website_domain) ??
      normalizeDomain(currentRole?.company_website),
    linkedinUrl: normalizeLinkedinUrl(
      currentRole?.company_professional_network_url,
    ),
    name: toText(currentRole?.name),
  });
};
