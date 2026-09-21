import { type ApolloApiResult } from 'src/logic-functions/types/apollo-api-result.type';
import { type ApolloRecord } from 'src/logic-functions/types/apollo-record.type';
import { callApolloApi } from 'src/logic-functions/utils/call-apollo-api';
import {
  toApolloPersonDetail,
  type ApolloPersonMatchParams,
} from 'src/logic-functions/utils/fetch-apollo-person';
import { toJsonObject } from '../data/to-json';

export const fetchApolloPeopleBulk = async ({
  params,
  accessToken,
  revealPersonalEmails,
}: {
  params: ApolloPersonMatchParams[];
  accessToken: string;
  revealPersonalEmails: boolean;
}): Promise<ApolloApiResult<(ApolloRecord | undefined)[]>> => {
  const result = await callApolloApi({
    path: '/people/bulk_match',
    method: 'POST',
    accessToken,
    query: { reveal_personal_emails: revealPersonalEmails },
    body: { details: params.map(toApolloPersonDetail) },
  });

  if (!result.success) {
    return result;
  }

  const matches = Array.isArray(result.data.matches) ? result.data.matches : [];

  // Apollo answers bulk_match positionally: one entry per requested detail,
  // null where it matched nobody.
  return {
    success: true,
    data: params.map((_, index) => toJsonObject(matches[index])),
  };
};
