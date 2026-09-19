import { isDefined } from 'twenty-sdk/utils';

import { buildPersonNameParam } from 'src/logic-functions/utils/build-person-name-param';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { resolveMinAccuracyScoreOrThrow } from 'src/logic-functions/utils/resolve-min-accuracy-score-or-throw';
import { toNumberLike } from 'src/logic-functions/utils/to-number-like';
import { toText } from 'src/logic-functions/utils/to-text';
import { type BulkEnrichInput } from 'src/types/bulk-enrich-input';
import { type PersonNode } from 'src/types/person-node';
import { type ZoomInfoContactMatchInput } from 'src/types/zoominfo-contact-match-input';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const extractContactMatchInput = ({
  node,
  input,
}: {
  node: PersonNode;
  input: BulkEnrichInput;
}): ZoomInfoContactMatchInput | undefined => {
  const minAccuracyScore = resolveMinAccuracyScoreOrThrow({
    inputMinAccuracyScore: input.minAccuracyScore,
    defaultMinAccuracyScore: process.env.ZOOMINFO_CONTACT_MIN_ACCURACY_SCORE,
  });

  const existingPersonId = toNumberLike(node.zoomInfoContactId);
  if (isDefined(existingPersonId)) {
    return pruneUndefined({
      personId: existingPersonId,
      contactAccuracyScoreMin: minAccuracyScore,
    });
  }

  const emailAddress = toText(node.emails?.primaryEmail);
  const externalUrl = normalizeLinkedinUrl(node.linkedinLink?.primaryLinkUrl);
  const fullName = buildPersonNameParam({
    firstName: node.name?.firstName,
    lastName: node.name?.lastName,
  });
  const companyName = toText(node.company?.name);
  const companyId = toNumberLike(node.zoomInfoCompanyId);

  // A bare name matches half the database, so it only counts as a signal when
  // paired with an employer or a stronger identifier.
  const hasStrongIdentifier = isDefined(emailAddress) || isDefined(externalUrl);
  const isNameUsable =
    isDefined(fullName) &&
    (hasStrongIdentifier || isDefined(companyName) || isDefined(companyId));

  const matchInput = pruneUndefined({
    emailAddress,
    externalURL: externalUrl,
    fullName: isNameUsable ? fullName : undefined,
    companyName: isNameUsable ? companyName : undefined,
    companyId: isNameUsable ? companyId : undefined,
  });

  if (Object.keys(matchInput).length === 0) {
    return undefined;
  }

  return pruneUndefined({
    ...matchInput,
    contactAccuracyScoreMin: minAccuracyScore,
  });
};
