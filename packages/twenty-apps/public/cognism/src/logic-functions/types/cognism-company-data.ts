import { type CognismLocation } from 'src/logic-functions/types/cognism-location';
import { type CognismPhoneNumber } from 'src/logic-functions/types/cognism-phone-number';

export type CognismCompanyData = {
  id?: string | null;
  redeemId?: string | null;
  name?: string | null;
  domain?: string | null;
  website?: string | null;
  linkedinUrl?: string | null;
  revenue?: number | null;
  locations?: CognismLocation[] | null;
  industries?: unknown;
  description?: string | null;
  shortDescription?: string | null;
  founded?: number | null;
  type?: string | null;
  sizeFrom?: number | null;
  sizeTo?: number | null;
  headcount?: number | null;
  naics?: unknown;
  sic?: unknown;
  officePhoneNumbers?: CognismPhoneNumber[] | null;
  technologies?: unknown;
  hiringEvent?: unknown[] | null;
  lastConfirmed?: string | null;
};
