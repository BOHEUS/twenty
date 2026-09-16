import {
  defineLogicFunction,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/define';
import { type DatabaseEventPayload } from 'twenty-sdk/logic-function';

import { APOLLO_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';
import { enrichCompanyHandler } from 'src/logic-functions/handlers/enrich-company';
import { type EnrichmentResult } from 'src/logic-functions/types/enrichment-result.type';

type CompanyUpdate = { id?: string | null };

const handler = async (
  event: DatabaseEventPayload<ObjectRecordUpdateEvent<CompanyUpdate>>,
): Promise<EnrichmentResult> => {
  const recordId = event.properties.after?.id ?? event.recordId;

  return enrichCompanyHandler({ recordId });
};

export default defineLogicFunction({
  universalIdentifier:
    APOLLO_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS.onCompanyUpdated,
  name: 'on-company-updated',
  description:
    'Enriches a company from Apollo when its domain changes, which is the key Apollo matches on.',
  timeoutSeconds: 60,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'company.updated',
    updatedFields: ['domainName'],
  },
});
