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
import { companyBulkEnrichmentAdapter } from 'src/logic-functions/handlers/company-bulk-enrichment-adapter';
import { runBulkEnrichment } from 'src/logic-functions/utils/run-bulk-enrichment';
import {
  toBulkEnrichmentInput,
} from 'src/logic-functions/utils/to-bulk-enrichment-input';
import { BulkEnrichmentFunctionInput } from "src/logic-functions/types/bulk-enrichment-input.type";

const inputSchema: InputJsonSchema = {
  type: 'object',
  properties: {
    records: {
      type: 'records',
      objectUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
      description: 'The ids of the Company records to enrich.',
      label: 'Records',
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
    adapter: companyBulkEnrichmentAdapter,
    context,
  });

export default defineLogicFunction({
  universalIdentifier:
    APOLLO_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS.enrichCompanies,
  name: 'enrich-companies',
  description:
    'Enrich several Company records with Apollo organization data in one run, through the Apollo bulk enrich endpoint.',
  timeoutSeconds: 300,
  handler,
  httpRouteTriggerSettings: {
    path: APOLLO_LOGIC_FUNCTION_ROUTE_PATHS.enrichCompanies,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
  toolTriggerSettings: { inputSchema },
  workflowActionTriggerSettings: {
    label: 'Enrich Companies with Apollo',
    icon: 'IconSparkles',
    inputSchema: jsonSchemaToInputSchema(inputSchema),
    outputSchema: BULK_ENRICHMENT_OUTPUT_SCHEMA,
  },
});
