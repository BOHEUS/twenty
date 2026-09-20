import { buildPersonNameParam } from 'src/logic-functions/utils/build-person-name-param';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { toText } from 'src/logic-functions/utils/to-text';
import { type PersonNode } from 'src/types/person-node';
import { type RocketReachPersonLookupParams } from 'src/types/rocketreach-person-lookup-params';
import { isDefined } from 'src/logic-functions/utils/is-defined';
import { pruneUndefined } from 'src/logic-functions/utils/prune-undefined';

export const extractPersonMatchParams = ({
  node,
}: {
  node: PersonNode;
}): RocketReachPersonLookupParams | undefined => {
  const profileId = toNumber(node.rocketReachId);
  if (isDefined(profileId)) {
    return { profileId };
  }

  const companyName = toText(node.company?.name);
  const fullName = buildPersonNameParam({
    firstName: node.name?.firstName,
    lastName: node.name?.lastName,
  });
  const isNameUsable = isDefined(fullName) && isDefined(companyName);

  const matchParams = pruneUndefined({
    linkedinUrl: toText(node.linkedinLink?.primaryLinkUrl),
    email: toText(node.emails?.primaryEmail),
    name: isNameUsable ? fullName : undefined,
    currentEmployer: isNameUsable ? companyName : undefined,
    title: isNameUsable ? toText(node.jobTitle) : undefined,
  });

  return Object.keys(matchParams).length === 0 ? undefined : matchParams;
};
