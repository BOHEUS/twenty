import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { type CompanyNode } from 'src/types/company-node';

export const extractCompanyMatchParams = ({
  node,
}: {
  node: CompanyNode;
}): string | undefined => normalizeDomain(node.domainName?.primaryLinkUrl);
