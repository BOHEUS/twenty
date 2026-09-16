import {
  defineLogicFunction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import {
  jsonSchemaToInputSchema,
  type InputJsonSchema,
  type LogicFunctionExecutionContext,
} from 'twenty-sdk/logic-function';

import { BULK_ENRICHMENT_OUTPUT_SCHEMA } from 'src/constants/bulk-enrichment-output-schema.constant';
import {
  APOLLO_LOGIC_FUNCTION_ROUTE_PATHS,
  APOLLO_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { personBulkEnrichmentAdapter } from 'src/logic-functions/handlers/person-bulk-enrichment-adapter';
import { runBulkEnrichment } from 'src/logic-functions/utils/run-bulk-enrichment';
import {
  toBulkEnrichmentInput,
  type BulkEnrichmentFunctionInput,
} from 'src/logic-functions/utils/to-bulk-enrichment-input';

const inputSchema: InputJsonSchema = {
  type: 'object',
  properties: {
    records: {
      type: 'records',
      objectUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
      description: 'The ids of the Person records to enrich.',
      label: 'Records',
    },
    revealPersonalEmails: {
      type: 'boolean',
      description:
        'Ask Apollo for personal email addresses. This consumes extra Apollo credits.',
      label: 'Reveal personal emails',
    },
  },
  required: ['records'],
  additionalProperties: false,
};

const handler = (
  input: BulkEnrichmentFunctionInput,
  context: LogicFunctionExecutionContext,
) =>
  runBulkEnrichment({
    input: toBulkEnrichmentInput(input),
    adapter: personBulkEnrichmentAdapter,
    context,
  });

export default defineLogicFunction({
  universalIdentifier: APOLLO_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS.enrichPeople,
  name: 'enrich-people',
  description:
    'Enrich several Person records with Apollo data in one run, through the Apollo bulk match endpoint.',
  timeoutSeconds: 300,
  handler,
  httpRouteTriggerSettings: {
    path: APOLLO_LOGIC_FUNCTION_ROUTE_PATHS.enrichPeople,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
  toolTriggerSettings: { inputSchema },
  workflowActionTriggerSettings: {
    label: 'Enrich People with Apollo',
    icon: 'IconSparkles',
    inputSchema: jsonSchemaToInputSchema(inputSchema),
    outputSchema: BULK_ENRICHMENT_OUTPUT_SCHEMA,
  },
});
