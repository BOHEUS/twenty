import {
  defineLogicFunction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { BULK_ENRICH_OUTPUT_SCHEMA } from 'src/constants/enrich-output-schemas';
import { UPDATE_FIELDS_OPTION_VALUES } from 'src/constants/update-fields-option-values';
import { COGNISM_LOGIC_FUNCTION_CONSTANTS } from 'src/constants/universal-identifiers';
import { enrichPeopleCore } from 'src/logic-functions/handlers/enrich-people';
import {
  type EnrichInput,
  toBulkEnrichInput,
} from 'src/logic-functions/utils/to-bulk-enrich-input';

const handler = (input: EnrichInput) => {
  return enrichPeopleCore({ input: toBulkEnrichInput(input) });
};

export default defineLogicFunction({
  universalIdentifier:
    COGNISM_LOGIC_FUNCTION_CONSTANTS.enrichPeople.universalIdentifier,
  name: 'enrich-people',
  description: 'Enrich one or more Person records with Cognism data',
  timeoutSeconds: 300,
  handler,
  httpRouteTriggerSettings: {
    path: COGNISM_LOGIC_FUNCTION_CONSTANTS.enrichPeople.path,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
  workflowActionTriggerSettings: {
    label: 'Enrich People',
    icon: 'IconSparkles',
    inputSchema: [
      {
        type: 'object',
        properties: {
          records: {
            type: 'records',
            objectUniversalIdentifier:
              STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
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
