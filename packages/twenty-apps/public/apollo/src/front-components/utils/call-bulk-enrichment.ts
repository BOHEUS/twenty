import { RestApiClient } from 'twenty-client-sdk/rest';
import { enqueueSnackbar } from 'twenty-sdk/front-component';

import { type BulkEnrichmentResult } from 'src/logic-functions/types/bulk-enrichment-result.type';
import { buildBulkEnrichmentSnackbar } from 'src/front-components/utils/build-bulk-enrichment-snackbar';

export const callBulkEnrichment = async ({
  path,
  recordIds,
}: {
  path: string;
  recordIds: string[];
}): Promise<void> => {
  try {
    const client = new RestApiClient();

    const result = await client.post<BulkEnrichmentResult>(`/s${path}`, {
      recordIds,
    });

    await enqueueSnackbar(buildBulkEnrichmentSnackbar(result));
  } catch {
    await enqueueSnackbar({
      message: 'Apollo enrichment failed.',
      variant: 'error',
    });
  }
};
