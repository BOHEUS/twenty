import { CoreApiClient } from 'twenty-client-sdk/core';

import { personEnrichmentAdapter } from 'src/logic-functions/handlers/person-enrichment-adapter';
import { runSingleEnrichment } from 'src/logic-functions/utils/run-single-enrichment';
import { type EnrichResult } from 'src/types/enrich-result';
import { type SingleEnrichInput } from 'src/types/single-enrich-input';

export const enrichPersonCore = ({
  input,
  client = new CoreApiClient(),
}: {
  input: SingleEnrichInput;
  client?: CoreApiClient;
}): Promise<EnrichResult> =>
  runSingleEnrichment({ client, input, adapter: personEnrichmentAdapter });
