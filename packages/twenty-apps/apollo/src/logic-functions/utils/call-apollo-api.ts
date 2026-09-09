import { type ApolloApiResult } from 'src/logic-functions/types/apollo-api-result.type';
import { type ApolloRecord } from 'src/logic-functions/types/apollo-record.type';

const APOLLO_API_BASE_URL = 'https://api.apollo.io/api/v1';
const RESPONSE_ERROR_EXCERPT_LENGTH = 500;

export const callApolloApi = async ({
  path,
  method,
  apiKey,
  body,
}: {
  path: string;
  method: 'GET' | 'POST';
  apiKey: string;
  body?: Record<string, unknown>;
}): Promise<ApolloApiResult<ApolloRecord>> => {
  let response: Response;

  try {
    response = await fetch(`${APOLLO_API_BASE_URL}${path}`, {
      method,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-api-key': apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    return {
      success: false,
      error: `Apollo API request failed: ${(error as Error).message}`,
    };
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');

    return {
      success: false,
      error: `Apollo API responded with ${response.status}: ${text.slice(0, RESPONSE_ERROR_EXCERPT_LENGTH)}`,
    };
  }

  try {
    return { success: true, data: (await response.json()) as ApolloRecord };
  } catch (error) {
    return {
      success: false,
      error: `Apollo API returned a non-JSON response: ${(error as Error).message}`,
    };
  }
};
