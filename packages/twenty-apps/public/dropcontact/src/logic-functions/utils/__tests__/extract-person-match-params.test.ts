import { describe, expect, it } from 'vitest';

import { PERSON_NODE_MOCK } from 'src/logic-functions/__mocks__/person-node.mock';
import { extractPersonMatchParams } from 'src/logic-functions/utils/extract-person-match-params';

const NODE_WITHOUT_IDENTIFIERS = { ...PERSON_NODE_MOCK, linkedinLink: null };

describe('extractPersonMatchParams', () => {
  it('sends the LinkedIn URL and tags the contact with the record id', () => {
    expect(extractPersonMatchParams({ node: PERSON_NODE_MOCK })).toEqual({
      recordId: 'p1',
      pendingRequestId: undefined,
      contact: {
        linkedin: 'https://linkedin.com/in/existing',
        custom_fields: { twenty_record_id: 'p1' },
      },
    });
  });

  it('sends a full name with the company name and domain', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...NODE_WITHOUT_IDENTIFIERS,
          name: { firstName: 'Jane', lastName: 'Doe' },
          company: {
            id: 'co1',
            name: 'Acme',
            domainName: { primaryLinkUrl: 'https://www.acme.com' },
          },
        },
      })?.contact,
    ).toEqual({
      first_name: 'Jane',
      last_name: 'Doe',
      company: 'Acme',
      website: 'acme.com',
      custom_fields: { twenty_record_id: 'p1' },
    });
  });

  it('keeps a stored request id so the batch is collected instead of resubmitted', () => {
    expect(
      extractPersonMatchParams({
        node: { ...PERSON_NODE_MOCK, dropcontactRequestId: 'request-1' },
      })?.pendingRequestId,
    ).toBe('request-1');
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
});
