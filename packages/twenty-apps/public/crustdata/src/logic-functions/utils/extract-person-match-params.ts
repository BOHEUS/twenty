import { isContactEnrichmentEnabled } from 'src/logic-functions/utils/is-contact-enrichment-enabled';
import { toText } from 'src/logic-functions/utils/to-text';
import { type BulkEnrichInput } from 'src/types/bulk-enrich-input';
import { type PersonEnrichParams } from 'src/types/person-enrich-params';
import { type PersonNode } from 'src/types/person-node';
import { isDefined } from 'src/utils/is-defined';

// Crustdata's synchronous person enrich only matches on a professional network profile URL. Without
// one the only lookup left is contact enrichment by business email, which returns emails and phone
// numbers but no profile; reverse email lookup to a profile is an async batch job.
export const extractPersonMatchParams = ({
  node,
  input,
}: {
  node: PersonNode;
  input: BulkEnrichInput;
}): PersonEnrichParams | undefined => {
  const enrichContactData =
    input.enrichContactData ?? isContactEnrichmentEnabled();
  const profileUrl = toText(node.linkedinLink?.primaryLinkUrl);

  if (isDefined(profileUrl)) {
    return { matchOn: 'profileUrl', profileUrl, enrichContactData };
  }

  const businessEmail = toText(node.emails?.primaryEmail);

  if (enrichContactData && isDefined(businessEmail)) {
    return { matchOn: 'businessEmail', businessEmail };
  }

  return undefined;
};
