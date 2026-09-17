import {
  defineLogicFunction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import {
  jsonSchemaToInputSchema,
  type InputJsonSchema,
} from 'twenty-sdk/logic-function';

import { BULK_ENRICHMENT_OUTPUT_SCHEMA } from 'src/constants/enrichment-schemas.constant';
import {
  LUSHA_LOGIC_FUNCTION_ROUTE_PATHS,
  LUSHA_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';
import { companyEnrichmentAdapter } from 'src/logic-functions/handlers/company-enrichment-adapter';
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
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
      label: 'Companies',
      description: 'The ids of the Company records to enrich.',
    },
  },
  required: ['records'],
  additionalProperties: false,
};

const handler = (input: BulkEnrichmentFunctionInput) =>
  runBulkEnrichment({
    input: toBulkEnrichmentInput(input),
    adapter: companyEnrichmentAdapter,
  });

export default defineLogicFunction({
  universalIdentifier:
    LUSHA_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS.enrichCompanies,
  name: 'enrich-companies',
  description:
    'Enrich Company records with Lusha by domain: industry, employee count, revenue range, funding, technologies and headquarters. Spends Lusha credits.',
  timeoutSeconds: 300,
  handler,
  httpRouteTriggerSettings: {
    path: LUSHA_LOGIC_FUNCTION_ROUTE_PATHS.enrichCompanies,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
  toolTriggerSettings: { inputSchema },
  workflowActionTriggerSettings: {
    label: 'Enrich Companies with Lusha',
    icon: 'IconBuildingSkyscraper',
    inputSchema: jsonSchemaToInputSchema(inputSchema),
    outputSchema: BULK_ENRICHMENT_OUTPUT_SCHEMA,
  },
});
