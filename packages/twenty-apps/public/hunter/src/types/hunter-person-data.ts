import { type HunterCompany } from 'src/types/hunter-company';
import { type HunterEmailFinderResult } from 'src/types/hunter-email-finder-result';
import { type HunterPerson } from 'src/types/hunter-person';

// A person can be built from the email Hunter found, the combined person and
// company enrichment behind an email, or the person behind a LinkedIn handle.
export type HunterPersonData = {
  emailFinder?: HunterEmailFinderResult;
  person?: HunterPerson;
  company?: HunterCompany;
};
