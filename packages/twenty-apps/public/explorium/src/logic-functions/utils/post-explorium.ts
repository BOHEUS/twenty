import { isNumber } from '@sniptt/guards';

import { EXPLORIUM_BASE_URL } from 'src/constants/explorium-base-url';
import { chargeExploriumCredits } from 'src/logic-functions/utils/charge-explorium-credits';
import { extractExploriumErrorMessage } from 'src/logic-functions/utils/extract-explorium-error-message';
import { getExploriumApiKey } from 'src/logic-functions/utils/get-explorium-api-key';
import { getExploriumCreditCostDollars } from 'src/logic-functions/utils/get-explorium-credit-cost-dollars';
import { parseRetryAfterMs } from 'src/logic-functions/utils/parse-retry-after-ms';
import { type ExploriumRequestResult } from 'src/types/explorium-request-result';
import { isRecord } from 'src/utils/is-record';

const MAX_RATE_LIMIT_RETRIES = 2;

const sleep = (durationMs: number) =>
  new Promise((resolve) => setTimeout(resolve, durationMs));

const readTotalCredits = (json: Record<string, unknown>): number => {
  const creditUsage = json.credit_usage;

  if (!isRecord(creditUsage)) {
    return 0;
  }

  return isNumber(creditUsage.total_credits) ? creditUsage.total_credits : 0;
};

export const postExplorium = async ({
  path,
  body,
  resourceContext,
}: {
  path: string;
  body: Record<string, unknown>;
  resourceContext: string;
}): Promise<ExploriumRequestResult> => {
  const apiKey = getExploriumApiKey();
  const creditCostDollars = getExploriumCreditCostDollars();

  for (let attempt = 0; ; attempt++) {
    let response: Response;
    try {
      response = await fetch(`${EXPLORIUM_BASE_URL}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          api_key: apiKey,
          'credit-usage': 'true',
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      return {
        ok: false,
        httpStatus: 0,
        message: `Explorium request failed: ${message}`,
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
        message: `Explorium returned a non-JSON response (HTTP ${response.status}).`,
      };
    }

    if (!response.ok || !isRecord(json)) {
      return {
        ok: false,
        httpStatus: response.status,
        message: extractExploriumErrorMessage({
          json,
          httpStatus: response.status,
        }),
      };
    }

    await chargeExploriumCredits({
      exploriumCredits: readTotalCredits(json),
      creditCostDollars,
      resourceContext,
    });

    return { ok: true, json };
  }
};
