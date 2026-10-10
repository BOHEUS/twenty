import { type SnovEmailCheck } from 'src/types/snov-email-check';

// Snov.io charges one credit for each email with a valid or unknown status
export const countEmailFinderCredits = (
  emailChecks: SnovEmailCheck[],
): number =>
  emailChecks.filter(
    (emailCheck) =>
      emailCheck.smtp_status === 'valid' ||
      emailCheck.smtp_status === 'unknown',
  ).length;
