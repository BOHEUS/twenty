import { isObject } from '@sniptt/guards';

import { COGNISM_BASE_URL } from 'src/constants/cognism-base-url';
import { extractCognismErrorMessage } from 'src/logic-functions/utils/extract-cognism-error-message';
import { getCognismApiKey } from 'src/logic-functions/utils/get-cognism-api-key';
import { toErrorMessage } from 'src/logic-functions/data/to-error-message';

export type CognismRequestOutcome =
  | { ok: true; httpStatus: number; json: unknown }
  | { ok: false; httpStatus: number; message: string };

export const postCognismRequest = async ({
  path,
  body,
}: {
  path: string;
  body: Record<string, unknown>;
}): Promise<CognismRequestOutcome> => {
  const apiKey = getCognismApiKey();

  let response: Response;
  try {
    response = await fetch(`${COGNISM_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    return {
      ok: false,
      httpStatus: 0,
      message: `Cognism request failed: ${toErrorMessage(error)}`,
    };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return {
      ok: false,
      httpStatus: response.status,
      message: `Cognism returned a non-JSON response (HTTP ${response.status}).`,
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      httpStatus: response.status,
      message: isObject(json)
        ? extractCognismErrorMessage({
            json: json as Record<string, unknown>,
            httpStatus: response.status,
          })
        : `Cognism request failed (HTTP ${response.status}).`,
    };
  }

  return { ok: true, httpStatus: response.status, json };
};
