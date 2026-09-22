import { FULLENRICH_BULK_ENRICH_URL } from 'src/constants/fullenrich-api';
import { type FullEnrichRequest } from 'src/logic-functions/types/fullenrich.types';

type SendResult =
  | { success: true; enrichmentId: string | undefined }
  | { success: false; status?: number; error: string };

export const sendRequestToFullEnrich = async ({
  request,
  apiKey,
}: {
  request: FullEnrichRequest;
  apiKey: string;
}): Promise<SendResult> => {
  let response: Response;

  try {
    response = await fetch(FULLENRICH_BULK_ENRICH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  } catch (error) {
    return {
      success: false,
      error: `FullEnrich request failed: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }

  const responseBody = await response.text();

  if (!response.ok) {
    return {
      success: false,
      status: response.status,
      error: `FullEnrich returned ${response.status}: ${responseBody}`,
    };
  }

  try {
    const parsed = JSON.parse(responseBody) as { enrichment_id?: string };

    return { success: true, enrichmentId: parsed.enrichment_id };
  } catch {
    return { success: true, enrichmentId: undefined };
  }
};
