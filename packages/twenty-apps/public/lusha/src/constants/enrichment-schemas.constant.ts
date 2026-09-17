import {
  type InputJsonSchema,
  type LogicFunctionConfig,
} from 'twenty-sdk/logic-function';

type WorkflowOutputSchema = NonNullable<
  NonNullable<
    LogicFunctionConfig['workflowActionTriggerSettings']
  >['outputSchema']
>;

export const REVEAL_PHONES_INPUT_SCHEMA: InputJsonSchema = {
  type: 'boolean',
  label: 'Reveal phone numbers',
  description:
    'Also reveal phone numbers, which cost more Lusha credits than emails. Defaults to the "Reveal phone numbers" setting of the Lusha app.',
};

export const BULK_ENRICHMENT_OUTPUT_SCHEMA: WorkflowOutputSchema = [
  {
    type: 'object',
    properties: {
      success: { type: 'boolean', label: 'Success' },
      total: { type: 'number', label: 'Total' },
      enriched: { type: 'number', label: 'Enriched' },
      notFound: { type: 'number', label: 'Not Found' },
      skipped: { type: 'number', label: 'Skipped' },
      errored: { type: 'number', label: 'Errored' },
      results: {
        type: 'array',
        items: {
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
        label: 'Results',
      },
    },
  },
];
