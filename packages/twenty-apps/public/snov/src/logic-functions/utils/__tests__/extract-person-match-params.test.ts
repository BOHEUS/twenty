import { describe, expect, it } from 'vitest';

import { PERSON_NODE_MOCK } from 'src/logic-functions/__mocks__/person-node.mock';
import { extractPersonMatchParams } from 'src/logic-functions/utils/extract-person-match-params';

const NODE_WITHOUT_IDENTIFIERS = { ...PERSON_NODE_MOCK, linkedinLink: null };

describe('extractPersonMatchParams', () => {
  it('sends the email and LinkedIn URL it has', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...PERSON_NODE_MOCK,
          emails: { primaryEmail: 'jane@acme.com' },
        },
      }),
    ).toEqual({
      email: 'jane@acme.com',
      linkedinUrl: 'https://linkedin.com/in/existing',
    });
  });

  it('can find an email from a full name and the company domain', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...NODE_WITHOUT_IDENTIFIERS,
          name: { firstName: 'Jane', lastName: 'Doe' },
          company: {
            id: 'co1',
            domainName: { primaryLinkUrl: 'https://www.acme.com' },
          },
        },
      }),
    ).toEqual({ firstName: 'Jane', lastName: 'Doe', domain: 'acme.com' });
  });

  it('skips a person with only a name', () => {
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
