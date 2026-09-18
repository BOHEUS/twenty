import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { resolveMinMatchScore } from 'src/logic-functions/utils/resolve-min-match-score';
import { toText } from 'src/logic-functions/utils/to-text';
import { type BulkEnrichInput } from 'src/logic-functions/types/bulk-enrich-input';
import { type CognismCompanyEnrichParams } from 'src/logic-functions/types/cognism-company-enrich-params';
import { type CompanyNode } from 'src/logic-functions/types/company-node';
import { isDefined } from 'src/logic-functions/data/is-defined';
import { pruneUndefined } from 'src/logic-functions/data/prune-undefined';

export const extractCompanyMatchParams = ({
  node,
  input,
}: {
  node: CompanyNode;
  input: BulkEnrichInput;
}): CognismCompanyEnrichParams | undefined => {
  const existingCognismId = toText(node.cognismId);
  if (isDefined(existingCognismId)) {
    return {
      cognismId: existingCognismId,
      minMatchScore: resolveMinMatchScore(input.minMatchScore),
    };
  }

  const companyMatchParams = pruneUndefined({
    domain: normalizeDomain(node.domainName?.primaryLinkUrl),
    linkedinUrl: normalizeLinkedinUrl(node.linkedinLink?.primaryLinkUrl),
    name: toText(node.name),
  });

  if (Object.keys(companyMatchParams).length === 0) {
    return undefined;
  }

  return {
    ...companyMatchParams,
    minMatchScore: resolveMinMatchScore(input.minMatchScore),
  };
};
