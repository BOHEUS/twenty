import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { toText } from 'src/logic-functions/utils/to-text';
import { type PersonNode } from 'src/types/person-node';
import { type SnovPersonMatchParams } from 'src/types/snov-person-match-params';
import { isDefined } from 'src/utils/is-defined';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const extractPersonMatchParams = ({
  node,
}: {
  node: PersonNode;
}): SnovPersonMatchParams | undefined => {
  const params = pruneUndefined({
    email: toText(node.emails?.primaryEmail),
    firstName: toText(node.name?.firstName),
    lastName: toText(node.name?.lastName),
    domain: normalizeDomain(node.company?.domainName?.primaryLinkUrl),
    linkedinUrl: toText(node.linkedinLink?.primaryLinkUrl),
  });

  const canFindEmail =
    isDefined(params.firstName) &&
    isDefined(params.lastName) &&
    isDefined(params.domain);

  return isDefined(params.email) ||
    isDefined(params.linkedinUrl) ||
    canFindEmail
    ? params
    : undefined;
};
