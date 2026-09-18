import { describe, expect, it } from 'vitest';

import { PERSON_NODE_MOCK } from 'src/logic-functions/__mocks__/person-node.mock';
import { extractPersonMatchParams } from 'src/logic-functions/utils/extract-person-match-params';

const INPUT = { records: [] };

describe('extractPersonMatchParams', () => {
  it('prefers an existing cognismId over every other identifier', () => {
    expect(
      extractPersonMatchParams({
        node: { ...PERSON_NODE_MOCK, cognismId: 'cognism-contact-1' },
        input: INPUT,
      }),
    ).toEqual({ cognismId: 'cognism-contact-1', minMatchScore: undefined });
  });

  it('normalizes the linkedin profile to the Cognism path format', () => {
    expect(
      extractPersonMatchParams({ node: PERSON_NODE_MOCK, input: INPUT }),
    ).toEqual({
      linkedinUrl: 'linkedin.com/in/existing',
      minMatchScore: undefined,
    });
  });

  it('pairs a name with the account name and domain', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...PERSON_NODE_MOCK,
          linkedinLink: null,
          name: { firstName: 'Jane', lastName: 'Doe' },
          company: {
            id: 'co-1',
            name: 'Acme',
            domainName: { primaryLinkUrl: 'https://www.acme.com/' },
          },
        },
        input: INPUT,
      }),
    ).toEqual({
      firstName: 'Jane',
      lastName: 'Doe',
      accountName: 'Acme',
      accountDomain: 'acme.com',
      minMatchScore: undefined,
    });
  });

  it('keeps the name when an email anchors it, even with no account', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...PERSON_NODE_MOCK,
          linkedinLink: null,
          emails: { primaryEmail: 'jane@acme.com' },
          name: { firstName: 'Jane', lastName: 'Doe' },
        },
        input: INPUT,
      }),
    ).toEqual({
      email: 'jane@acme.com',
      firstName: 'Jane',
      lastName: 'Doe',
      minMatchScore: undefined,
    });
  });

  it('drops a name with no anchoring identifier or account', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...PERSON_NODE_MOCK,
          linkedinLink: null,
          name: { firstName: 'Jane', lastName: 'Doe' },
        },
        input: INPUT,
      }),
    ).toBeUndefined();
  });

  it('drops a partial name even when an account anchors it', () => {
    expect(
      extractPersonMatchParams({
        node: {
          ...PERSON_NODE_MOCK,
          linkedinLink: null,
          name: { firstName: 'Jane', lastName: '' },
          company: { id: 'co-1', name: 'Acme' },
        },
        input: INPUT,
      }),
    ).toBeUndefined();
  });

  it('honors an explicit minMatchScore from the input', () => {
    expect(
      extractPersonMatchParams({
        node: PERSON_NODE_MOCK,
        input: { records: [], minMatchScore: 90 },
      }),
    ).toMatchObject({ minMatchScore: 90 });
  });

  it('rejects a minMatchScore outside the Cognism range', () => {
    expect(() =>
      extractPersonMatchParams({
        node: PERSON_NODE_MOCK,
        input: { records: [], minMatchScore: 101 },
      }),
    ).toThrow('Minimum match score must be an integer between 0 and 100.');
  });

  it('returns undefined when there is no usable identifier', () => {
    expect(
      extractPersonMatchParams({
        node: { ...PERSON_NODE_MOCK, linkedinLink: null },
        input: INPUT,
      }),
    ).toBeUndefined();
  });
});
