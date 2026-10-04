export type PhoneLookupMatchBasis = 'PRIMARY_PHONE' | 'ADDITIONAL_PHONE';

export type PhoneLookupInput = {
  phoneNumber: string;
  defaultCountryCode?: string;
};

export type PhoneLookupCandidate = {
  personId: string;
  matchBasis: PhoneLookupMatchBasis;
  matchedPhoneNumber: string;
};

// Candidates are returned in full and never linked: a company main line
// stored on several people is the caller's call to resolve. isTruncated
// says the candidate scan hit its cap, so matching people may be missing.
export type PhoneLookupResult = {
  normalizedPhoneNumber: string | null;
  candidates: PhoneLookupCandidate[];
  isTruncated: boolean;
};
