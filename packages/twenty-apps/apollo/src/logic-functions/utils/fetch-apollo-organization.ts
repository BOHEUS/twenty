import { type ApolloApiResult } from 'src/logic-functions/types/apollo-api-result.type';
import { type ApolloRecord } from 'src/logic-functions/types/apollo-record.type';
import { callApolloApi } from 'src/logic-functions/utils/call-apollo-api';
import { toJsonObject } from '../data/to-json';

export const fetchApolloOrganization = async ({
  domain,
  apiKey,
}: {
  domain: string;
  apiKey: string;
}): Promise<ApolloApiResult<ApolloRecord | undefined>> => {
  const result = await callApolloApi({
    path: `/organizations/enrich?domain=${encodeURIComponent(domain)}`,
    method: 'GET',
    apiKey,
  });

  if (!result.success) {
    return result;
  }

  return { success: true, data: toJsonObject(result.data.organization) };
};
