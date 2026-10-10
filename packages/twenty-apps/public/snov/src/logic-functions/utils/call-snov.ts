import { SNOV_BASE_URL } from 'src/constants/snov-base-url';
import { extractSnovErrorMessage } from 'src/logic-functions/utils/extract-snov-error-message';
import { getSnovAccessToken } from 'src/logic-functions/utils/get-snov-access-token';
import { parseRetryAfterMs } from 'src/logic-functions/utils/parse-retry-after-ms';
import { sleep } from 'src/logic-functions/utils/sleep';
import { waitForSnovRateLimit } from 'src/logic-functions/utils/wait-for-snov-rate-limit';
import { type SnovRequestResult } from 'src/types/snov-request-result';
import { isDefined } from 'src/utils/is-defined';
import { isRecord } from 'src/utils/is-record';

const MAX_RATE_LIMIT_RETRIES = 2;

type SnovRequestBody =
  | { form: URLSearchParams }
  | { json: Record<string, unknown> };

const toRequestBody = (body: SnovRequestBody | undefined) => {
  if (!isDefined(body)) {
    return {};
  }

  return 'form' in body
    ? {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.form,
      }
    : {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body.json),
      };
};

export const callSnov = async ({
  method,
  path,
  body,
}: {
  method: 'GET' | 'POST';
  path: string;
  body?: SnovRequestBody;
}): Promise<SnovRequestResult> => {
  const accessToken = await getSnovAccessToken();

  // v1 endpoints document the token as an access_token parameter, v2 as a header
  if (path.startsWith('/v1/') && isDefined(body) && 'form' in body) {
    body.form.set('access_token', accessToken);
  }

  const requestBody = toRequestBody(body);

  for (let attempt = 0; ; attempt++) {
    await waitForSnovRateLimit();

    let response: Response;
    try {
      response = await fetch(`${SNOV_BASE_URL}${path}`, {
        method,
        headers: {
          ...requestBody.headers,
          Authorization: `Bearer ${accessToken}`,
        },
        body: requestBody.body,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      return {
        ok: false,
        httpStatus: 0,
        message: `Snov.io request failed: ${message}`,
      };
    }

    if (response.status === 429 && attempt < MAX_RATE_LIMIT_RETRIES) {
      await sleep(parseRetryAfterMs(response.headers.get('Retry-After')));
      continue;
    }

    let json: unknown;
    try {
      json = await response.json();
    } catch {
      return {
        ok: false,
        httpStatus: response.status,
        message: `Snov.io returned a non-JSON response (HTTP ${response.status}).`,
      };
    }

    if (!response.ok || !isRecord(json)) {
      return {
        ok: false,
        httpStatus: response.status,
        message: extractSnovErrorMessage({
          json,
          httpStatus: response.status,
        }),
      };
    }

    return { ok: true, httpStatus: response.status, json };
  }
};
