import { describe, expect, it } from 'vitest';

import { PERSON_NODE_MOCK } from 'src/logic-functions/__mocks__/person-node.mock';
import { extractPersonMatchParams } from 'src/logic-functions/utils/extract-person-match-params';

const NODE_WITHOUT_IDENTIFIERS = { ...PERSON_NODE_MOCK, linkedinLink: null };

describe('extractPersonMatchParams', () => {
  it('reuses a stored Explorium prospect id instead of matching again', () => {
    expect(
      extractPersonMatchParams({
        node: { ...PERSON_NODE_MOCK, exploriumId: 'prospect-1' },
      }),
    ).toEqual({ exploriumId: 'prospect-1' });
  });

  it('matches on the LinkedIn URL', () => {
    expect(extractPersonMatchParams({ node: PERSON_NODE_MOCK })).toEqual({
      matchInput: { linkedin: 'https://linkedin.com/in/existing' },
    });
  });

  it('matches on the primary email and sends the name along', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...NODE_WITHOUT_IDENTIFIERS,
          emails: { primaryEmail: 'jane@acme.com' },
          name: { firstName: 'Jane', lastName: 'Doe' },
        },
      }),
    ).toEqual({
      matchInput: { email: 'jane@acme.com', full_name: 'Jane Doe' },
    });
  });

  it('matches on a full name paired with the company name', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...NODE_WITHOUT_IDENTIFIERS,
          name: { firstName: 'Jane', lastName: 'Doe' },
          company: { id: 'co1', name: 'Acme' },
        },
      }),
    ).toEqual({
      matchInput: { full_name: 'Jane Doe', company_name: 'Acme' },
    });
  });

  it('skips a name without a company', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...NODE_WITHOUT_IDENTIFIERS,
          name: { firstName: 'Jane', lastName: 'Doe' },
        },
      }),
    ).toBeUndefined();
  });

  it('skips a record with no identifier', () => {
    expect(
      extractPersonMatchParams({ node: NODE_WITHOUT_IDENTIFIERS }),
    ).toBeUndefined();
  });
});
