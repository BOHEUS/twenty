import { type ApolloApiResult } from 'src/logic-functions/types/apollo-api-result.type';
import { type ApolloRecord } from 'src/logic-functions/types/apollo-record.type';

const APOLLO_API_BASE_URL = 'https://api.apollo.io/api/v1';
const RESPONSE_ERROR_EXCERPT_LENGTH = 500;
const AUTH_FAILURE_STATUSES = new Set([401, 403]);

const buildQueryString = (
  query: Record<string, string | string[] | boolean> | undefined,
): string => {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query ?? {})) {
    for (const item of Array.isArray(value) ? value : [value]) {
      searchParams.append(key, String(item));
    }
  }

  const queryString = searchParams.toString();

  return queryString === '' ? '' : `?${queryString}`;
};

export const callApolloApi = async ({
  path,
  method,
  accessToken,
  query,
  body,
}: {
  path: string;
  method: 'GET' | 'POST';
  accessToken: string;
  query?: Record<string, string | string[] | boolean>;
  body?: Record<string, unknown>;
}): Promise<ApolloApiResult<ApolloRecord>> => {
  let response: Response;

  try {
    response = await fetch(
      `${APOLLO_API_BASE_URL}${path}${buildQueryString(query)}`,
      {
        method,
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      },
    );
  } catch (error) {
    return {
      success: false,
      error: `Apollo API request failed: ${(error as Error).message}`,
      isAuthFailure: false,
    };
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');

    return {
      success: false,
      error: `Apollo API responded with ${response.status}: ${text.slice(0, RESPONSE_ERROR_EXCERPT_LENGTH)}`,
      isAuthFailure: AUTH_FAILURE_STATUSES.has(response.status),
    };
  }

  try {
    return { success: true, data: (await response.json()) as ApolloRecord };
  } catch (error) {
    return {
      success: false,
      error: `Apollo API returned a non-JSON response: ${(error as Error).message}`,
      isAuthFailure: false,
    };
  }
};
