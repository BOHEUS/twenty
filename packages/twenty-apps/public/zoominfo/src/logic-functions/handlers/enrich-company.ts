import { CoreApiClient } from 'twenty-client-sdk/core';

import { companyEnrichmentAdapter } from 'src/logic-functions/handlers/company-enrichment-adapter';
import { runSingleEnrichment } from 'src/logic-functions/utils/run-single-enrichment';
import { type EnrichResult } from 'src/types/enrich-result';
import { type SingleEnrichInput } from 'src/types/single-enrich-input';

export const enrichCompanyCore = ({
  input,
  client = new CoreApiClient(),
}: {
  input: SingleEnrichInput;
  client?: CoreApiClient;
}): Promise<EnrichResult> =>
  runSingleEnrichment({ client, input, adapter: companyEnrichmentAdapter });
