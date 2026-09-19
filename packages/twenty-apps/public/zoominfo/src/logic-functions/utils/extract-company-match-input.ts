import { isDefined } from 'twenty-sdk/utils';

import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { toNumberLike } from 'src/logic-functions/utils/to-number-like';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CompanyNode } from 'src/types/company-node';
import { type ZoomInfoCompanyMatchInput } from 'src/types/zoominfo-company-match-input';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const extractCompanyMatchInput = ({
  node,
}: {
  node: CompanyNode;
}): ZoomInfoCompanyMatchInput | undefined => {
  const existingCompanyId = toNumberLike(node.zoomInfoCompanyId);
  if (isDefined(existingCompanyId)) {
    return { companyId: existingCompanyId };
  }

  const matchInput = pruneUndefined({
    companyWebsite: normalizeDomain(node.domainName?.primaryLinkUrl),
    companyName: toText(node.name),
  });

  return Object.keys(matchInput).length === 0 ? undefined : matchInput;
};
