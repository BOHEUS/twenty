import {
  type FullEnrichContactInfo,
  type FullEnrichEmail,
} from 'src/logic-functions/types/fullenrich.types';
import { type TwentyEmails } from 'src/logic-functions/types/twenty.types';

const USABLE_STATUSES: FullEnrichEmail['status'][] = [
  'DELIVERABLE',
  'HIGH_PROBABILITY',
];

const isUsable = (email: FullEnrichEmail | undefined): boolean =>
  !!email?.email && USABLE_STATUSES.includes(email.status);

export const buildTwentyEmails = (
  contactInfo: FullEnrichContactInfo,
): TwentyEmails | undefined => {
  const usableEmails = [
    ...(contactInfo.work_emails ?? []),
    ...(contactInfo.personal_emails ?? []),
  ].filter(isUsable);

  // most_probable_* is FullEnrich's own pick, so it wins over list order
  const primaryEmail =
    (isUsable(contactInfo.most_probable_work_email)
      ? contactInfo.most_probable_work_email?.email
      : undefined) ??
    (isUsable(contactInfo.most_probable_personal_email)
      ? contactInfo.most_probable_personal_email?.email
      : undefined) ??
    usableEmails[0]?.email;

  if (!primaryEmail) {
    return undefined;
  }

  const additionalEmails = [
    ...new Set(usableEmails.map(({ email }) => email)),
  ].filter((email) => email !== primaryEmail);

  return {
    primaryEmail,
    additionalEmails: additionalEmails.length > 0 ? additionalEmails : null,
  };
};
