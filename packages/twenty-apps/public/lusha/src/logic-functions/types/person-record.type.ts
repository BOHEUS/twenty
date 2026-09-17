import { type EmailsField } from 'twenty-sdk/define';

import { type LinksValue } from 'src/logic-functions/types/links-value.type';
import { type PartialNullable } from 'src/logic-functions/types/partial-nullable.type';
import { type PhonesValue } from 'src/logic-functions/types/phones-value.type';

export type PersonRecord = {
  id: string;
  name?: { firstName?: string | null; lastName?: string | null } | null;
  emails?: PartialNullable<EmailsField> | null;
  phones?: PartialNullable<PhonesValue> | null;
  jobTitle?: string | null;
  linkedinLink?: PartialNullable<LinksValue> | null;
  company?: {
    id?: string | null;
    name?: string | null;
    domainName?: { primaryLinkUrl?: string | null } | null;
  } | null;
  lushaId?: string | null;
};
