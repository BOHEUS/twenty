import { type LogicFunctionConfig } from 'twenty-sdk/logic-function';

type WorkflowOutputSchema = NonNullable<
  NonNullable<
    LogicFunctionConfig['workflowActionTriggerSettings']
  >['outputSchema']
>;

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
