import { type SnovEmailCheck } from 'src/types/snov-email-check';
import { type SnovJob } from 'src/types/snov-job';
import { type SnovLinkedinProfile } from 'src/types/snov-linkedin-profile';

export type SnovEmailProfile = {
  id?: string | number | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  logo?: string | null;
  industry?: string | null;
  country?: string | null;
  locality?: string | null;
  lastUpdateDate?: string | null;
  social?: { link?: string | null; type?: string | null }[] | null;
  currentJobs?: SnovJob[] | null;
  previousJobs?: SnovJob[] | null;
};

// One person can be built from up to three Snov.io lookups: the email found
// by name and domain, the profile behind an email, or a LinkedIn profile.
export type SnovPersonData = {
  email?: string;
  emailCheck?: SnovEmailCheck;
  emailProfile?: SnovEmailProfile;
  linkedinProfile?: SnovLinkedinProfile;
};
