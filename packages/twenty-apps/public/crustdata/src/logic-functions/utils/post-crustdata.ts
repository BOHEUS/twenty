import {
  CRUSTDATA_API_VERSION,
  CRUSTDATA_BASE_URL,
  CRUSTDATA_RATE_LIMIT_MAX_RETRIES,
} from 'src/constants/crustdata-api';
import { getCrustdataApiKey } from 'src/logic-functions/utils/get-crustdata-api-key';
import { resolveRetryAfterSeconds } from 'src/logic-functions/utils/resolve-retry-after-seconds';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CrustdataResponse } from 'src/types/crustdata-response';
import { isDefined } from 'src/utils/is-defined';

const CREDITS_USED_HEADER = 'x-credits-used';
const TOO_MANY_REQUESTS = 429;

export class CrustdataRequestError extends Error {
  readonly httpStatus: number;

  constructor({ message, httpStatus }: { message: string; httpStatus: number }) {
    super(message);
    this.name = 'CrustdataRequestError';
    this.httpStatus = httpStatus;
  }
}

const parseCreditsUsed = (response: Response): number => {
  const rawCreditsUsed = toText(response.headers.get(CREDITS_USED_HEADER));

  if (!isDefined(rawCreditsUsed)) {
    return 0;
  }

  const creditsUsed = Number.parseFloat(rawCreditsUsed);

  return Number.isFinite(creditsUsed) && creditsUsed > 0 ? creditsUsed : 0;
};

const wait = (seconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const sendRequest = async ({
  path,
  body,
  apiKey,
}: {
  path: string;
  body: Record<string, unknown>;
  apiKey: string;
}): Promise<Response> => {
  try {
    return await fetch(`${CRUSTDATA_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'x-api-version': CRUSTDATA_API_VERSION,
      },
      body: JSON.stringify(body),
    });
  } catch (requestError) {
    const message =
      requestError instanceof Error ? requestError.message : String(requestError);

    throw new CrustdataRequestError({
      message: `Crustdata request failed: ${message}`,
      httpStatus: 0,
    });
  }
};

export const postCrustdata = async ({
  path,
  body,
}: {
  path: string;
  body: Record<string, unknown>;
}): Promise<CrustdataResponse> => {
  const apiKey = getCrustdataApiKey();

  let response = await sendRequest({ path, body, apiKey });

  for (
    let attempt = 0;
    response.status === TOO_MANY_REQUESTS &&
    attempt < CRUSTDATA_RATE_LIMIT_MAX_RETRIES;
    attempt++
  ) {
    const retryAfterSeconds = resolveRetryAfterSeconds(response);

    if (!isDefined(retryAfterSeconds)) {
      break;
    }

    await wait(retryAfterSeconds);
    response = await sendRequest({ path, body, apiKey });
  }

  const creditsUsed = parseCreditsUsed(response);

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new CrustdataRequestError({
      message: `Crustdata returned a non-JSON response (HTTP ${response.status}).`,
      httpStatus: response.status,
    });
  }

  return { json, httpStatus: response.status, creditsUsed };
};
