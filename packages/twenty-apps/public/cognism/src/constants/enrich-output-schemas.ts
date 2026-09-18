const ENRICH_RESULT_PROPERTIES = {
  success: { type: 'boolean', label: 'Success' },
  recordId: { type: 'string', label: 'Record Id' },
  status: { type: 'string', label: 'Status' },
  updatedFields: {
    type: 'array',
    items: { type: 'string' },
    label: 'Updated Fields',
  },
  data: { type: 'object', label: 'Data' },
  message: { type: 'string', label: 'Message' },
} as const;

export const SINGLE_ENRICH_OUTPUT_SCHEMA = {
  type: 'object',
  properties: ENRICH_RESULT_PROPERTIES,
} as const;

export const BULK_ENRICH_OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    success: { type: 'boolean', label: 'Success' },
    total: { type: 'number', label: 'Total' },
    matched: { type: 'number', label: 'Matched' },
    notFound: { type: 'number', label: 'Not Found' },
    skipped: { type: 'number', label: 'Skipped' },
    errored: { type: 'number', label: 'Errored' },
    results: {
      type: 'array',
      items: { type: 'object', properties: ENRICH_RESULT_PROPERTIES },
      label: 'Results',
    },
  },
} as const;
