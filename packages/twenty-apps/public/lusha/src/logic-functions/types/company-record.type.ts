import { type AddressValue } from 'src/logic-functions/types/address-value.type';
import { type LinksValue } from 'src/logic-functions/types/links-value.type';
import { type PartialNullable } from 'src/logic-functions/types/partial-nullable.type';

export type CompanyRecord = {
  id: string;
  name?: string | null;
  domainName?: PartialNullable<LinksValue> | null;
  linkedinLink?: PartialNullable<LinksValue> | null;
  address?: PartialNullable<AddressValue> | null;
  lushaId?: string | null;
};
