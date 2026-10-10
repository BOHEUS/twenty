import { describe, expect, it } from 'vitest';

import { PERSON_NODE_MOCK } from 'src/logic-functions/__mocks__/person-node.mock';
import { extractPersonMatchParams } from 'src/logic-functions/utils/extract-person-match-params';

describe('extractPersonMatchParams', () => {
  it('sends the LinkedIn URL and notes whether a phone is already known', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...PERSON_NODE_MOCK,
          phones: { primaryPhoneNumber: '+15125550100' },
        },
      }),
    ).toEqual({
      linkedinUrl: 'https://linkedin.com/in/existing',
      hasPhone: true,
    });
  });

  it('sends a full name with the company domain and name', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...PERSON_NODE_MOCK,
          linkedinLink: null,
          name: { firstName: 'Jane', lastName: 'Doe' },
          company: {
            id: 'co1',
            name: 'Acme',
            domainName: { primaryLinkUrl: 'https://acme.com' },
          },
        },
      }),
    ).toEqual({
      name: 'Jane Doe',
      companyDomain: 'acme.com',
      companyName: 'Acme',
      hasPhone: false,
    });
  });

  it('skips a person with only a name', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...PERSON_NODE_MOCK,
          linkedinLink: null,
          name: { firstName: 'Jane', lastName: 'Doe' },
        },
      }),
    ).toBeUndefined();
  });
});
