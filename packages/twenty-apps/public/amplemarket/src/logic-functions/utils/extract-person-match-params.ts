import { buildFullNameText } from 'src/logic-functions/utils/build-full-name-text';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { toText } from 'src/logic-functions/utils/to-text';
import { type AmplemarketPersonMatchParams } from 'src/types/amplemarket-person-match-params';
import { type PersonNode } from 'src/types/person-node';
import { isDefined } from 'src/utils/is-defined';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const extractPersonMatchParams = ({
  node,
}: {
  node: PersonNode;
}): AmplemarketPersonMatchParams | undefined => {
  const params = pruneUndefined({
    email: toText(node.emails?.primaryEmail),
    linkedinUrl: toText(node.linkedinLink?.primaryLinkUrl),
    name: buildFullNameText(node.name),
    companyDomain: normalizeDomain(node.company?.domainName?.primaryLinkUrl),
    companyName: toText(node.company?.name),
  });

  const hasNameAndCompany =
    isDefined(params.name) &&
    (isDefined(params.companyDomain) || isDefined(params.companyName));

  if (
    !isDefined(params.email) &&
    !isDefined(params.linkedinUrl) &&
    !hasNameAndCompany
  ) {
    return undefined;
  }

  return {
    ...params,
    hasPhone: isDefined(toText(node.phones?.primaryPhoneNumber)),
  };
};
