import { isNonEmptyString } from '@sniptt/guards';

import { DROPCONTACT_RECORD_ID_CUSTOM_FIELD } from 'src/constants/dropcontact-record-id-custom-field';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { toText } from 'src/logic-functions/utils/to-text';
import { type DropcontactMatchParams } from 'src/types/dropcontact-match-params';
import { type PersonNode } from 'src/types/person-node';
import { isDefined } from 'src/utils/is-defined';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const extractPersonMatchParams = ({
  node,
}: {
  node: PersonNode;
}): DropcontactMatchParams | undefined => {
  const email = toText(node.emails?.primaryEmail);
  const linkedin = toText(node.linkedinLink?.primaryLinkUrl);
  const firstName = toText(node.name?.firstName);
  const lastName = toText(node.name?.lastName);
  const company = toText(node.company?.name);

  // Dropcontact needs an email, a LinkedIn URL, or a full name with a company
  const hasNameAndCompany =
    isDefined(firstName) && isDefined(lastName) && isDefined(company);

  if (!isDefined(email) && !isDefined(linkedin) && !hasNameAndCompany) {
    return undefined;
  }

  const pendingRequestId = toText(node.dropcontactRequestId);

  return {
    recordId: node.id,
    pendingRequestId: isNonEmptyString(pendingRequestId)
      ? pendingRequestId
      : undefined,
    contact: {
      ...pruneUndefined({
        email,
        linkedin,
        first_name: firstName,
        last_name: lastName,
        company,
        website: normalizeDomain(node.company?.domainName?.primaryLinkUrl),
        phone: toText(node.phones?.primaryPhoneNumber),
        job: toText(node.jobTitle),
      }),
      custom_fields: { [DROPCONTACT_RECORD_ID_CUSTOM_FIELD]: node.id },
    },
  };
};
