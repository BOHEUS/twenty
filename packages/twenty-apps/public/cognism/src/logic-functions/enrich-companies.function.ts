import {
  defineLogicFunction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { BULK_ENRICH_OUTPUT_SCHEMA } from 'src/constants/enrich-output-schemas';
import { UPDATE_FIELDS_OPTION_VALUES } from 'src/constants/update-fields-option-values';
import { COGNISM_LOGIC_FUNCTION_CONSTANTS } from 'src/constants/universal-identifiers';
import { enrichCompaniesCore } from 'src/logic-functions/handlers/enrich-companies';
import {
  type EnrichInput,
  toBulkEnrichInput,
} from 'src/logic-functions/utils/to-bulk-enrich-input';

const handler = (input: EnrichInput) => {
  return enrichCompaniesCore({ input: toBulkEnrichInput(input) });
};

export default defineLogicFunction({
  universalIdentifier:
    COGNISM_LOGIC_FUNCTION_CONSTANTS.enrichCompanies.universalIdentifier,
  name: 'enrich-companies',
  description: 'Enrich one or more Company records with Cognism data',
  timeoutSeconds: 300,
  handler,
  httpRouteTriggerSettings: {
    path: COGNISM_LOGIC_FUNCTION_CONSTANTS.enrichCompanies.path,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
  workflowActionTriggerSettings: {
    label: 'Enrich Companies',
    icon: 'IconSparkles',
    inputSchema: [
      {
        type: 'object',
        properties: {
          records: {
            type: 'records',
            objectUniversalIdentifier:
              STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
            label: 'Records',
          },
          updateFields: {
            type: 'string',
            label: 'Update fields',
            enum: [...UPDATE_FIELDS_OPTION_VALUES],
          },
          minMatchScore: {
            type: 'number',
            label: 'Minimum match score (0-100)',
          },
        },
      },
    ],
    outputSchema: [{ ...BULK_ENRICH_OUTPUT_SCHEMA }],
  },
});
