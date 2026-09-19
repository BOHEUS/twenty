import { RestApiClient } from 'twenty-client-sdk/rest';
import { enqueueSnackbar } from 'twenty-sdk/front-component';

import { buildEnrichmentSnackbar } from 'src/front-components/utils/build-enrichment-snackbar';
import { type BulkEnrichResult } from 'src/types/bulk-enrich-result';
import { toErrorMessage } from 'src/utils/to-error-message';

export const execute = async ({
  path,
  recordIds,
}: {
  path: string;
  recordIds: string[];
}) => {
  try {
    const client = new RestApiClient();

    const result = await client.post<BulkEnrichResult>(`/s${path}`, {
      recordIds,
    });

    await enqueueSnackbar(buildEnrichmentSnackbar(result));
  } catch (error) {
    await enqueueSnackbar({
      message: 'Records enrichment failed',
      variant: 'error',
      detailedMessage: toErrorMessage(error),
    });
  }
};
