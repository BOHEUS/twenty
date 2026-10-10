import { extractLinkedinHandle } from 'src/logic-functions/utils/extract-linkedin-handle';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { toText } from 'src/logic-functions/utils/to-text';
import { type HunterPersonMatchParams } from 'src/types/hunter-person-match-params';
import { type PersonNode } from 'src/types/person-node';
import { isDefined } from 'src/utils/is-defined';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const extractPersonMatchParams = ({
  node,
}: {
  node: PersonNode;
}): HunterPersonMatchParams | undefined => {
  const params = pruneUndefined({
    email: toText(node.emails?.primaryEmail),
    linkedinHandle: extractLinkedinHandle(node.linkedinLink?.primaryLinkUrl),
    firstName: toText(node.name?.firstName),
    lastName: toText(node.name?.lastName),
    domain: normalizeDomain(node.company?.domainName?.primaryLinkUrl),
    companyName: toText(node.company?.name),
  });

  const hasNameAndCompany =
    isDefined(params.firstName) &&
    isDefined(params.lastName) &&
    (isDefined(params.domain) || isDefined(params.companyName));

  return isDefined(params.email) ||
    isDefined(params.linkedinHandle) ||
    hasNameAndCompany
    ? params
    : undefined;
};
