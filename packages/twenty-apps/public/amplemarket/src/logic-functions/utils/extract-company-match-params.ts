import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { toText } from 'src/logic-functions/utils/to-text';
import { type AmplemarketCompanyMatchParams } from 'src/types/amplemarket-company-match-params';
import { type CompanyNode } from 'src/types/company-node';
import { isDefined } from 'src/utils/is-defined';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const extractCompanyMatchParams = ({
  node,
}: {
  node: CompanyNode;
}): AmplemarketCompanyMatchParams | undefined => {
  const params = pruneUndefined({
    domain: normalizeDomain(node.domainName?.primaryLinkUrl),
    linkedinUrl: toText(node.linkedinLink?.primaryLinkUrl),
  });

  return isDefined(params.domain) || isDefined(params.linkedinUrl)
    ? params
    : undefined;
};
