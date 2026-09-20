import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CompanyNode } from 'src/types/company-node';
import { type RocketReachCompanyLookupParams } from 'src/types/rocketreach-company-lookup-params';
import { isDefined } from 'src/logic-functions/utils/is-defined';
import { pruneUndefined } from 'src/logic-functions/utils/prune-undefined';

export const extractCompanyMatchParams = ({
  node,
}: {
  node: CompanyNode;
}): RocketReachCompanyLookupParams | undefined => {
  const companyId = toNumber(node.rocketReachId);
  if (isDefined(companyId)) {
    return { companyId };
  }

  const matchParams = pruneUndefined({
    domain: normalizeDomain(node.domainName?.primaryLinkUrl),
    linkedinUrl: toText(node.linkedinLink?.primaryLinkUrl),
    name: toText(node.name),
  });

  return Object.keys(matchParams).length === 0 ? undefined : matchParams;
};
