import { DROPCONTACT_BASE_URL } from 'src/constants/dropcontact-base-url';
import { extractDropcontactErrorMessage } from 'src/logic-functions/utils/extract-dropcontact-error-message';
import { getDropcontactApiKey } from 'src/logic-functions/utils/get-dropcontact-api-key';
import { parseRetryAfterMs } from 'src/logic-functions/utils/parse-retry-after-ms';
import { sleep } from 'src/logic-functions/utils/sleep';
import { type DropcontactRequestResult } from 'src/types/dropcontact-request-result';
import { isDefined } from 'src/utils/is-defined';
import { isRecord } from 'src/utils/is-record';

const MAX_RATE_LIMIT_RETRIES = 2;

export const callDropcontact = async ({
  method,
  path,
  body,
}: {
  method: 'GET' | 'POST';
  path: string;
  body?: Record<string, unknown>;
}): Promise<DropcontactRequestResult> => {
  const apiKey = getDropcontactApiKey();

  for (let attempt = 0; ; attempt++) {
    let response: Response;
    try {
      response = await fetch(`${DROPCONTACT_BASE_URL}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': apiKey,
        },
        body: isDefined(body) ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      return {
        ok: false,
        httpStatus: 0,
        message: `Dropcontact request failed: ${message}`,
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
        message: `Dropcontact returned a non-JSON response (HTTP ${response.status}).`,
      };
    }

    if (!response.ok || !isRecord(json)) {
      return {
        ok: false,
        httpStatus: response.status,
        message: extractDropcontactErrorMessage({
          json,
          httpStatus: response.status,
        }),
      };
    }

    return { ok: true, httpStatus: response.status, json };
  }
};
