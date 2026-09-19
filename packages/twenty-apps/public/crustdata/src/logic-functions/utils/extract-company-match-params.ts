import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CompanyEnrichParams } from 'src/types/company-enrich-params';
import { type CompanyNode } from 'src/types/company-node';
import { isDefined } from 'src/utils/is-defined';

// Ordered by how precisely each identifier resolves: a Crustdata id is exact, a domain is close,
// a name is a guess. Company enrich accepts only one identifier type per request.
export const extractCompanyMatchParams = ({
  node,
}: {
  node: CompanyNode;
}): CompanyEnrichParams | undefined => {
  const crustdataCompanyId = toText(node.crustdataCompanyId);

  if (isDefined(crustdataCompanyId)) {
    return {
      identifierType: 'crustdata_company_ids',
      identifier: crustdataCompanyId,
    };
  }

  const domain = normalizeDomain(node.domainName?.primaryLinkUrl);

  if (isDefined(domain)) {
    return { identifierType: 'domains', identifier: domain };
  }

  const profileUrl = toText(node.linkedinLink?.primaryLinkUrl);

  if (isDefined(profileUrl)) {
    return {
      identifierType: 'professional_network_profile_urls',
      identifier: profileUrl,
    };
  }

  const name = toText(node.name);

  if (isDefined(name)) {
    return { identifierType: 'names', identifier: name };
  }

  return undefined;
};
