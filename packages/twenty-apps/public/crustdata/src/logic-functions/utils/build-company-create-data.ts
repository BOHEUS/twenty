import { buildLinks } from 'src/logic-functions/utils/build-links';
import { currentEmployment } from 'src/logic-functions/utils/current-employment';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { toIdText } from 'src/logic-functions/utils/to-id-text';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CrustdataPersonData } from 'src/types/crustdata-person-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const buildCompanyCreateData = (
  personData: CrustdataPersonData,
): Record<string, unknown> => {
  const currentRole = currentEmployment(personData);
  const domain =
    normalizeDomain(currentRole?.company_website_domain) ??
    normalizeDomain(currentRole?.company_website);

  return pruneUndefined({
    name: toText(currentRole?.name),
    domainName: buildLinks({ url: domain }),
    linkedinLink: buildLinks({
      url: currentRole?.company_professional_network_url,
    }),
    crustdataCompanyId: toIdText(currentRole?.crustdata_company_id),
  });
};
