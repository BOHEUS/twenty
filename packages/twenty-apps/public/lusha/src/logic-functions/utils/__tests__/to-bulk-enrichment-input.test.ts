import { describe, expect, it } from 'vitest';

import { toBulkEnrichmentInput } from 'src/logic-functions/utils/to-bulk-enrichment-input';

describe('toBulkEnrichmentInput', () => {
  it('should read the record ids a command sends to the route', () => {
    expect(
      toBulkEnrichmentInput({
        headers: {},
        queryStringParameters: {},
        pathParameters: {},
        body: { recordIds: ['person-1', 'person-2'] },
        isBase64Encoded: false,
        requestContext: {
          http: { method: 'POST', path: '/lusha/enrich-people' },
        },
        userWorkspaceId: null,
      }),
    ).toEqual({ records: ['person-1', 'person-2'] });
  });

  it('should pass a workflow or tool input through', () => {
    const input = { records: [{ id: 'person-1' }], revealPhones: true };

    expect(toBulkEnrichmentInput(input)).toBe(input);
  });
});
