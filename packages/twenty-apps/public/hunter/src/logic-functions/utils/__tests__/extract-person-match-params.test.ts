import { describe, expect, it } from 'vitest';

import { PERSON_NODE_MOCK } from 'src/logic-functions/__mocks__/person-node.mock';
import { extractPersonMatchParams } from 'src/logic-functions/utils/extract-person-match-params';

describe('extractPersonMatchParams', () => {
  it('turns the LinkedIn URL into a handle', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...PERSON_NODE_MOCK,
          linkedinLink: {
            primaryLinkUrl: 'https://www.linkedin.com/in/jane-doe/',
          },
        },
      }),
    ).toEqual({ linkedinHandle: 'jane-doe' });
  });

  it('sends the name with the company domain and name', () => {
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
      firstName: 'Jane',
      lastName: 'Doe',
      domain: 'acme.com',
      companyName: 'Acme',
    });
  });

  it('keeps a handle with a malformed escape as is', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...PERSON_NODE_MOCK,
          linkedinLink: { primaryLinkUrl: 'https://linkedin.com/in/jane%E0' },
        },
      })?.linkedinHandle,
    ).toBe('jane%E0');
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
