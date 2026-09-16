import { type ApolloApiResult } from 'src/logic-functions/types/apollo-api-result.type';
import { type ApolloRecord } from 'src/logic-functions/types/apollo-record.type';
import { callApolloApi } from 'src/logic-functions/utils/call-apollo-api';
import { pruneUndefined } from '../data/prune-undefined';
import { toJsonObject } from '../data/to-json';

export type ApolloPersonMatchParams = {
  email?: string;
  firstName?: string;
  lastName?: string;
  domain?: string;
  linkedinUrl?: string;
};

export const toApolloPersonDetail = (
  params: ApolloPersonMatchParams,
): Record<string, unknown> =>
  pruneUndefined({
    email: params.email,
    first_name: params.firstName,
    last_name: params.lastName,
    domain: params.domain,
    linkedin_url: params.linkedinUrl,
  });

export const fetchApolloPerson = async ({
  params,
  accessToken,
  revealPersonalEmails,
}: {
  params: ApolloPersonMatchParams;
  accessToken: string;
  revealPersonalEmails: boolean;
}): Promise<ApolloApiResult<ApolloRecord | undefined>> => {
  const result = await callApolloApi({
    path: '/people/match',
    method: 'POST',
    accessToken,
    body: {
      ...toApolloPersonDetail(params),
      reveal_personal_emails: revealPersonalEmails,
    },
  });

  if (!result.success) {
    return result;
  }

  return { success: true, data: toJsonObject(result.data.person) };
};
