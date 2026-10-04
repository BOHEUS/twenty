import {
  type PhoneLookupInput,
  type PhoneLookupResult,
} from 'twenty-shared/application';

import { postGraphqlRequest } from '@/sdk/logic-function/utils/post-graphql-request.util';

const LOOKUP_PEOPLE_BY_PHONE_NUMBER_QUERY = `
  query LookupPeopleByPhoneNumber($input: PhoneLookupInput!) {
    lookupPeopleByPhoneNumber(input: $input) {
      normalizedPhoneNumber
      isTruncated
      candidates {
        personId
        matchBasis
        matchedPhoneNumber
      }
    }
  }
`;

// Read-only: returns every person carrying the number so the app decides
// what to link. Requires the IS_TELEPHONY_ENABLED feature flag on the
// workspace, and only sees the people the run's identity may read.
export const lookupPeopleByPhoneNumber = async (
  input: PhoneLookupInput,
): Promise<PhoneLookupResult> => {
  const { lookupPeopleByPhoneNumber: result } = await postGraphqlRequest<
    { input: PhoneLookupInput },
    { lookupPeopleByPhoneNumber: PhoneLookupResult }
  >({
    query: LOOKUP_PEOPLE_BY_PHONE_NUMBER_QUERY,
    variables: { input },
    caller: 'lookupPeopleByPhoneNumber',
  });

  return result;
};
