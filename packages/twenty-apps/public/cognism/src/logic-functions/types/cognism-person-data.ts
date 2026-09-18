import { type CognismPhoneNumber } from 'src/logic-functions/types/cognism-phone-number';

export type CognismPersonAccount = {
  id?: string | null;
  name?: string | null;
  domain?: string | null;
  website?: string | null;
  linkedinUrl?: string | null;
};

export type CognismPersonData = {
  id?: string | null;
  redeemId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  jobTitle?: string | null;
  linkedinUrl?: string | null;
  country?: string | null;
  email?: { address?: string | null; quality?: string | null } | null;
  mobilePhoneNumbers?: CognismPhoneNumber[] | null;
  managementLevel?: string | null;
  jobFunction?: string | string[] | null;
  positionStartDate?: string | null;
  lastConfirmed?: string | null;
  previousAccounts?: unknown[] | null;
  education?: unknown[] | null;
  skills?: unknown;
  privacyNotificationSent?: boolean | null;
  jobJoinEvent?: unknown[] | null;
  jobLeaveEvent?: unknown[] | null;
  account?: CognismPersonAccount | null;
};
