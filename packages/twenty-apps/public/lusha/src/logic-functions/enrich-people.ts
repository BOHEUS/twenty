import {
  defineLogicFunction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import {
  jsonSchemaToInputSchema,
  type InputJsonSchema,
} from 'twenty-sdk/logic-function';

import { ENRICHMENT_TIMEOUT_SECONDS } from 'src/constants/enrichment-run.constant';
import {
  BULK_ENRICHMENT_OUTPUT_SCHEMA,
  REVEAL_PHONES_INPUT_SCHEMA,
} from 'src/constants/enrichment-schemas.constant';
import {
  LUSHA_LOGIC_FUNCTION_ROUTE_PATHS,
  LUSHA_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { personEnrichmentAdapter } from 'src/logic-functions/handlers/person-enrichment-adapter';
import { runBulkEnrichment } from 'src/logic-functions/utils/run-bulk-enrichment';
import {
  toBulkEnrichmentInput,
  type BulkEnrichmentFunctionInput,
} from 'src/logic-functions/utils/to-bulk-enrichment-input';

const ENRICH_PEOPLE_INPUT_SCHEMA: InputJsonSchema = {
  type: 'object',
  properties: {
    records: {
      type: 'records',
      objectUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
      label: 'People',
      description: 'The ids of the Person records to enrich.',
    },
    revealPhones: REVEAL_PHONES_INPUT_SCHEMA,
  },
  required: ['records'],
  additionalProperties: false,
};

const handler = (input: BulkEnrichmentFunctionInput) =>
  runBulkEnrichment({
    input: toBulkEnrichmentInput(input),
    adapter: personEnrichmentAdapter,
  });

export default defineLogicFunction({
  universalIdentifier: LUSHA_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS.enrichPeople,
  name: 'enrich-people',
  description:
    'Enrich Person records with Lusha: job title, seniority, departments, location, work emails and, when revealed, phone numbers. Spends Lusha credits.',
  timeoutSeconds: ENRICHMENT_TIMEOUT_SECONDS,
  handler,
  httpRouteTriggerSettings: {
    path: LUSHA_LOGIC_FUNCTION_ROUTE_PATHS.enrichPeople,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
  toolTriggerSettings: { inputSchema: ENRICH_PEOPLE_INPUT_SCHEMA },
  workflowActionTriggerSettings: {
    label: 'Enrich People with Lusha',
    icon: 'IconUser',
    inputSchema: jsonSchemaToInputSchema(ENRICH_PEOPLE_INPUT_SCHEMA),
    outputSchema: BULK_ENRICHMENT_OUTPUT_SCHEMA,
  },
});
