import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { resolveMinMatchScore } from 'src/logic-functions/utils/resolve-min-match-score';
import { toText } from 'src/logic-functions/utils/to-text';
import { type BulkEnrichInput } from 'src/logic-functions/types/bulk-enrich-input';
import { type CognismPersonEnrichParams } from 'src/logic-functions/types/cognism-person-enrich-params';
import { type PersonNode } from 'src/logic-functions/types/person-node';
import { isDefined } from 'src/logic-functions/data/is-defined';
import { pruneUndefined } from 'src/logic-functions/data/prune-undefined';

export const extractPersonMatchParams = ({
  node,
  input,
}: {
  node: PersonNode;
  input: BulkEnrichInput;
}): CognismPersonEnrichParams | undefined => {
  const existingCognismId = toText(node.cognismId);
  if (isDefined(existingCognismId)) {
    return {
      cognismId: existingCognismId,
      minMatchScore: resolveMinMatchScore(input.minMatchScore),
    };
  }

  const linkedinUrl = normalizeLinkedinUrl(node.linkedinLink?.primaryLinkUrl);
  const email = toText(node.emails?.primaryEmail);
  const firstName = toText(node.name?.firstName);
  const lastName = toText(node.name?.lastName);
  const accountName = toText(node.company?.name);
  const accountDomain = normalizeDomain(
    node.company?.domainName?.primaryLinkUrl,
  );

  const hasStrongIdentifier = isDefined(linkedinUrl) || isDefined(email);
  const hasAccountIdentifier =
    isDefined(accountName) || isDefined(accountDomain);

  // A name alone matches too many people, so Cognism only gets it when it is
  // paired with an employer or a strong identifier.
  const nameIsUsableAsMatchSignal =
    isDefined(firstName) &&
    isDefined(lastName) &&
    (hasStrongIdentifier || hasAccountIdentifier);

  const personMatchParams = pruneUndefined({
    linkedinUrl,
    email,
    firstName: nameIsUsableAsMatchSignal ? firstName : undefined,
    lastName: nameIsUsableAsMatchSignal ? lastName : undefined,
    accountName: nameIsUsableAsMatchSignal ? accountName : undefined,
    accountDomain: nameIsUsableAsMatchSignal ? accountDomain : undefined,
  });

  if (Object.keys(personMatchParams).length === 0) {
    return undefined;
  }

  return {
    ...personMatchParams,
    minMatchScore: resolveMinMatchScore(input.minMatchScore),
  };
};
