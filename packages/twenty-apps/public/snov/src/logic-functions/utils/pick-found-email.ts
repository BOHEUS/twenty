import { isNonEmptyString } from '@sniptt/guards';

import { type SnovEmailCheck } from 'src/types/snov-email-check';

const SMTP_STATUS_PRIORITY = ['valid', 'unknown'];

export const pickFoundEmail = (
  emailChecks: SnovEmailCheck[],
): SnovEmailCheck | undefined =>
  SMTP_STATUS_PRIORITY.map((smtpStatus) =>
    emailChecks.find(
      (emailCheck) =>
        isNonEmptyString(emailCheck.email) &&
        emailCheck.smtp_status === smtpStatus,
    ),
  ).find((emailCheck) => emailCheck !== undefined);
