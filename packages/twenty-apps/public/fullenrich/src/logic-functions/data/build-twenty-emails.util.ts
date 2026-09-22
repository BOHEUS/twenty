import { ContactInfo } from "src/logic-functions/shared/types";

export const buildTwentyEmails = (contactInfo: ContactInfo) => {
  const primaryEmail =
    contactInfo.most_probable_work_email?.email ??
    contactInfo.most_probable_personal_email?.email ??
    '';
  const deliverableEmails = [
    ...(contactInfo.work_emails ?? []),
    ...(contactInfo.personal_emails ?? []),
  ]
  .filter((email) => ['DELIVERABLE', 'HIGH_PROBABILITY'].includes(email.status))
  .map((email) => email.email)
  .filter((email) => email !== primaryEmail);
  return {
    primaryEmail,
    additionalEmails: deliverableEmails.length > 0 ? deliverableEmails : null,
  };
};