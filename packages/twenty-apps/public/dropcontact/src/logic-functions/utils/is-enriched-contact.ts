import { isNonEmptyString } from '@sniptt/guards';

import { toDropcontactEmails } from 'src/logic-functions/utils/to-dropcontact-emails';
import { type DropcontactContactInput } from 'src/types/dropcontact-contact-input';
import { type DropcontactPersonData } from 'src/types/dropcontact-person-data';

const ENRICHMENT_ONLY_KEYS = [
  'civility',
  'mobile_phone',
  'job_level',
  'job_function',
  'company_linkedin',
  'nb_employees',
  'employee_count',
  'industry',
  'siren',
  'siret',
  'vat',
  'naf5_code',
] as const;

// Dropcontact returns the submitted contact unchanged when it finds nothing,
// so a match is any value it added on top of the input.
export const isEnrichedContact = ({
  contact,
  input,
}: {
  contact: DropcontactPersonData;
  input: DropcontactContactInput;
}): boolean =>
  ENRICHMENT_ONLY_KEYS.some((key) => isNonEmptyString(contact[key])) ||
  toDropcontactEmails(contact.email).some((email) =>
    isNonEmptyString(email.qualification),
  ) ||
  (!isNonEmptyString(input.linkedin) && isNonEmptyString(contact.linkedin)) ||
  (!isNonEmptyString(input.phone) && isNonEmptyString(contact.phone)) ||
  (!isNonEmptyString(input.website) && isNonEmptyString(contact.website));
