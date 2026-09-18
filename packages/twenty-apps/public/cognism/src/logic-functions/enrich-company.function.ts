import {
  defineLogicFunction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SINGLE_ENRICH_OUTPUT_SCHEMA } from 'src/constants/enrich-output-schemas';
import { UPDATE_FIELDS_OPTION_VALUES } from 'src/constants/update-fields-option-values';
import { COGNISM_LOGIC_FUNCTION_CONSTANTS } from 'src/constants/universal-identifiers';
import { enrichCompanyCore } from 'src/logic-functions/handlers/enrich-company';
import { type SingleEnrichInput } from 'src/logic-functions/types/single-enrich-input';

const handler = (input: SingleEnrichInput) => enrichCompanyCore({ input });

export default defineLogicFunction({
  universalIdentifier:
    COGNISM_LOGIC_FUNCTION_CONSTANTS.enrichCompany.universalIdentifier,
  name: 'enrich-company',
  description:
    'Enrich a single Company record with Cognism data (industry, size, funding, location, etc.) given its record id.',
  timeoutSeconds: 60,
  handler,
  workflowActionTriggerSettings: {
    label: 'Enrich Company',
    icon: 'IconSparkles',
    inputSchema: [
      {
        type: 'object',
        properties: {
          recordId: {
            type: 'record',
            objectUniversalIdentifier:
              STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
            label: 'Record',
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
    outputSchema: [{ ...SINGLE_ENRICH_OUTPUT_SCHEMA }],
  },
  toolTriggerSettings: {
    inputSchema: {
      type: 'object',
      properties: {
        recordId: {
          type: 'string',
          description: 'The id of the Company record to enrich.',
        },
        updateFields: {
          type: 'string',
          enum: [...UPDATE_FIELDS_OPTION_VALUES],
          description:
            'Whether to write the enriched data back to the record. "Yes and overwrite" replaces existing values; "Yes and don\'t overwrite" only fills empty fields; "No" returns the enriched data without modifying the record.',
        },
      },
      required: ['recordId'],
      additionalProperties: false,
    },
  },
});
