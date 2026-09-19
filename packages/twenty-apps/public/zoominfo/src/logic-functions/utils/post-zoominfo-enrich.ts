import { ZOOMINFO_BASE_URL } from 'src/constants/zoominfo-base-url';
import { ZOOMINFO_JSON_API_CONTENT_TYPE } from 'src/constants/zoominfo-json-api-content-type';
import { alignResponseItems } from 'src/logic-functions/utils/align-response-items';
import { extractZoomInfoErrorMessage } from 'src/logic-functions/utils/extract-zoominfo-error-message';
import { fetchWithRetry } from 'src/logic-functions/utils/fetch-with-retry';
import { getZoomInfoAccessTokenOrThrow } from 'src/logic-functions/utils/get-zoominfo-access-token-or-throw';
import { parseZoomInfoResponseItem } from 'src/logic-functions/utils/parse-zoominfo-response-item';
import { type ZoomInfoEnrichResult } from 'src/types/zoominfo-enrich-result';
import { isRecord } from 'src/utils/is-record';
import { toErrorMessage } from 'src/utils/to-error-message';

export const postZoomInfoEnrich = async <TData, TInput>({
  path,
  resourceType,
  matchInputKey,
  matchInputs,
  outputFields,
}: {
  path: string;
  resourceType: 'ContactEnrich' | 'CompanyEnrich';
  matchInputKey: 'matchPersonInput' | 'matchCompanyInput';
  matchInputs: TInput[];
  outputFields: readonly string[];
}): Promise<ZoomInfoEnrichResult<TData>[]> => {
  if (matchInputs.length === 0) {
    return [];
  }

  const failAll = (message: string): ZoomInfoEnrichResult<TData>[] =>
    matchInputs.map(() => ({ outcome: 'error', message }));

  let response: Response;
  try {
    const accessToken = await getZoomInfoAccessTokenOrThrow();

    response = await fetchWithRetry(`${ZOOMINFO_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': ZOOMINFO_JSON_API_CONTENT_TYPE,
        Accept: ZOOMINFO_JSON_API_CONTENT_TYPE,
      },
      body: JSON.stringify({
        data: {
          type: resourceType,
          attributes: {
            [matchInputKey]: matchInputs,
            outputFields: [...outputFields],
          },
        },
      }),
    });
  } catch (error) {
    return failAll(`ZoomInfo request failed: ${toErrorMessage(error)}`);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return failAll(
      `ZoomInfo returned a non-JSON response (HTTP ${response.status}).`,
    );
  }

  if (!response.ok) {
    return failAll(
      extractZoomInfoErrorMessage({ json, httpStatus: response.status }),
    );
  }

  const responseData = isRecord(json) ? json.data : undefined;

  if (!Array.isArray(responseData)) {
    return failAll('ZoomInfo returned a response without a data array.');
  }

  return alignResponseItems({
    matchInputs,
    responseItems: responseData,
  }).map((responseItem) => parseZoomInfoResponseItem<TData>(responseItem));
};
