import {
  defineLogicFunction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { type LogicFunctionExecutionContext } from 'twenty-sdk/logic-function';

import { APOLLO_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';
import { enrichPersonHandler } from 'src/logic-functions/handlers/enrich-person';

const handler = (
  {
    recordId,
    revealPersonalEmails,
  }: {
    recordId: string;
    revealPersonalEmails?: boolean;
  },
  context: LogicFunctionExecutionContext,
) => enrichPersonHandler({ recordId, revealPersonalEmails, context });

export default defineLogicFunction({
  universalIdentifier: APOLLO_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS.enrichPerson,
  name: 'enrich-person',
  description:
    'Enrich a Person record with Apollo data: headline, seniority, departments, employment history, location, email status and social profiles.',
  timeoutSeconds: 60,
  handler,
  toolTriggerSettings: {
    inputSchema: {
      type: 'object',
      properties: {
        recordId: {
          type: 'string',
          description: 'The id of the Person record to enrich.',
        },
        revealPersonalEmails: {
          type: 'boolean',
          description:
            'Ask Apollo for personal email addresses. This consumes extra Apollo credits.',
        },
      },
      required: ['recordId'],
      additionalProperties: false,
    },
  },
  workflowActionTriggerSettings: {
    label: 'Enrich Person with Apollo',
    icon: 'IconSparkles',
    inputSchema: [
      {
        type: 'object',
        properties: {
          recordId: {
            type: 'record',
            objectUniversalIdentifier:
              STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
            label: 'Record',
          },
          revealPersonalEmails: {
            type: 'boolean',
            label: 'Reveal personal emails',
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
