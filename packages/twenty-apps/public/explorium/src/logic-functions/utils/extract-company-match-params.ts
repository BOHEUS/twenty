import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CompanyNode } from 'src/types/company-node';
import { type ExploriumBusinessMatchInput } from 'src/types/explorium-match-inputs';
import { type ExploriumMatchParams } from 'src/types/explorium-match-params';
import { isDefined } from 'src/utils/is-defined';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const extractCompanyMatchParams = ({
  node,
}: {
  node: CompanyNode;
}): ExploriumMatchParams<ExploriumBusinessMatchInput> | undefined => {
  const existingExploriumId = toText(node.exploriumId);
  if (isDefined(existingExploriumId)) {
    return { exploriumId: existingExploriumId };
  }

  const domain = normalizeDomain(node.domainName?.primaryLinkUrl);
  const linkedinUrl = toText(node.linkedinLink?.primaryLinkUrl);

  // A name alone matches too loosely to write firmographics onto the record
  if (!isDefined(domain) && !isDefined(linkedinUrl)) {
    return undefined;
  }

  return {
    matchInput: pruneUndefined({
      name: toText(node.name),
      domain,
      linkedin_url: linkedinUrl,
    }),
  };
};
