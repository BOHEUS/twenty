import { type CognismPersonData } from 'src/logic-functions/types/cognism-person-data';

export const COGNISM_PERSON_DATA_MOCK: CognismPersonData = {
  id: 'cognism-contact-1',
  redeemId: 'redeem-contact-1',
  firstName: 'jane',
  lastName: 'doe',
  jobTitle: 'Chief Executive Officer',
  linkedinUrl: 'https://linkedin.com/in/janedoe',
  country: 'United Kingdom',
  email: { address: 'jane.doe@acme.com', quality: 'Verified' },
  mobilePhoneNumbers: [
    { number: '+441234567890', score: 90, dnc: false },
    { number: '+441234567891', score: 40, dnc: true },
  ],
  managementLevel: 'C-Level',
  jobFunction: ['Sales', 'Marketing', 'Interplanetary Logistics'],
  positionStartDate: '2021-06-01',
  lastConfirmed: '2026-08-14',
  previousAccounts: [{ name: 'Globex' }],
  education: [{ school: 'Imperial College London' }],
  skills: ['leadership', 'Leadership', 'strategy'],
  privacyNotificationSent: true,
  jobJoinEvent: [{ date: '2021-06-01' }],
  jobLeaveEvent: [],
  account: {
    id: 'cognism-account-1',
    name: 'Acme',
    domain: 'acme.com',
    website: 'https://www.acme.com',
    linkedinUrl: 'https://www.linkedin.com/company/acme/',
  },
};
