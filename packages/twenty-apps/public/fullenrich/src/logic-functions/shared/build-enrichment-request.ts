import { isNonEmptyString } from '@sniptt/guards';

import { type FullEnrichEnrichField } from 'src/constants/application-variables';
import { sanitizeDomain } from 'src/logic-functions/utils/sanitize-domain.util';
import {
  type FullEnrichCustomProperties,
  type FullEnrichRequest,
  type FullEnrichRequestContact,
} from 'src/logic-functions/types/fullenrich.types';
import { type TwentyCompany, type TwentyPerson } from 'src/logic-functions/types/twenty.types';

// Only linkedin_url makes FullEnrich return the `profile` block, so a contact
// matched on name alone comes back with contact details and nothing else
export const buildEnrichmentRequestContact = ({
  person,
  company,
  enrichFields,
}: {
  person: TwentyPerson;
  company?: TwentyCompany;
  enrichFields: FullEnrichEnrichField[];
}): FullEnrichRequestContact | undefined => {
  const linkedinUrl = person.linkedinLink?.primaryLinkUrl?.trim();
  const firstName = person.name?.firstName?.trim();
  const lastName = person.name?.lastName?.trim();
  const domain = sanitizeDomain(company?.domainName?.primaryLinkUrl);
  const companyName = company?.name?.trim();

  const isMatchable =
    isNonEmptyString(linkedinUrl) ||
    (isNonEmptyString(firstName) &&
      isNonEmptyString(lastName) &&
      (isNonEmptyString(domain) || isNonEmptyString(companyName)));

  if (!isMatchable) {
    return undefined;
  }

  return {
    ...(isNonEmptyString(linkedinUrl) && { linkedin_url: linkedinUrl }),
    ...(isNonEmptyString(firstName) && { first_name: firstName }),
    ...(isNonEmptyString(lastName) && { last_name: lastName }),
    ...(isNonEmptyString(domain) && { domain }),
    ...(isNonEmptyString(companyName) && { company_name: companyName }),
    enrich_fields: enrichFields,
    custom: {
      personId: person.id,
      ...(isNonEmptyString(person.companyId) && { companyId: person.companyId }),
    } satisfies FullEnrichCustomProperties,
  };
};

// The name is what identifies the batch in the FullEnrich dashboard
const buildRequestName = (contacts: FullEnrichRequestContact[]): string => {
  if (contacts.length > 1) {
    return `${contacts.length} contacts`;
  }

  const [contact] = contacts;
  const fullName = [contact?.first_name, contact?.last_name]
    .filter(isNonEmptyString)
    .join(' ');

  return isNonEmptyString(fullName)
    ? fullName
    : (contact?.linkedin_url ?? '1 contact');
};

export const buildEnrichmentRequest = ({
  contacts,
  webhookUrl,
}: {
  contacts: FullEnrichRequestContact[];
  webhookUrl: string;
}): FullEnrichRequest => ({
  name: `Twenty contact enrichment - ${buildRequestName(contacts)}`,
  webhook_url: webhookUrl,
  data: contacts,
});
