import {
  defineLogicFunction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { type LogicFunctionExecutionContext } from 'twenty-sdk/logic-function';

import { APOLLO_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';
import { enrichCompanyHandler } from 'src/logic-functions/handlers/enrich-company';

const handler = (
  { recordId }: { recordId: string },
  context: LogicFunctionExecutionContext,
) => enrichCompanyHandler({ recordId, context });

export default defineLogicFunction({
  universalIdentifier:
    APOLLO_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS.enrichCompany,
  name: 'enrich-company',
  description:
    'Enrich a Company record with Apollo organization data: industry, keywords, employee count, funding, technologies, social profiles and corporate hierarchy.',
  timeoutSeconds: 60,
  handler,
  toolTriggerSettings: {
    inputSchema: {
      type: 'object',
      properties: {
        recordId: {
          type: 'string',
          description: 'The id of the Company record to enrich.',
        },
      },
      required: ['recordId'],
      additionalProperties: false,
    },
  },
  workflowActionTriggerSettings: {
    label: 'Enrich Company with Apollo',
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
        },
      },
    ],
    outputSchema: [
      {
        type: 'object',
        properties: {
          success: { type: 'boolean', label: 'Success' },
          recordId: { type: 'string', label: 'Record Id' },
          status: { type: 'string', label: 'Status' },
          updatedFields: {
            type: 'array',
            items: { type: 'string' },
            label: 'Updated Fields',
          },
          message: { type: 'string', label: 'Message' },
        },
      },
    ],
  },
});
