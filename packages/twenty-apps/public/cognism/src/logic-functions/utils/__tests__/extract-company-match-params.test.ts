import { describe, expect, it } from 'vitest';

import { COMPANY_NODE_MOCK } from 'src/logic-functions/__mocks__/company-node.mock';
import { extractCompanyMatchParams } from 'src/logic-functions/utils/extract-company-match-params';

const INPUT = { records: [] };

describe('extractCompanyMatchParams', () => {
  it('prefers an existing cognismId over every other identifier', () => {
    expect(
      extractCompanyMatchParams({
        node: { ...COMPANY_NODE_MOCK, cognismId: 'cognism-account-1' },
        input: INPUT,
      }),
    ).toEqual({ cognismId: 'cognism-account-1', minMatchScore: undefined });
  });

  it('uses the domain and the name together', () => {
    expect(
      extractCompanyMatchParams({
        node: { ...COMPANY_NODE_MOCK, name: 'Acme' },
        input: INPUT,
      }),
    ).toEqual({ domain: 'acme.com', name: 'Acme', minMatchScore: undefined });
  });

  it('normalizes the linkedin profile to the Cognism path format', () => {
    expect(
      extractCompanyMatchParams({
        node: {
          ...COMPANY_NODE_MOCK,
          domainName: null,
          linkedinLink: {
            primaryLinkUrl: 'https://www.linkedin.com/company/acme/',
          },
          name: 'Acme',
        },
        input: INPUT,
      }),
    ).toEqual({
      linkedinUrl: 'linkedin.com/company/acme',
      name: 'Acme',
      minMatchScore: undefined,
    });
  });

  it('strips the scheme and www from the domain before matching', () => {
    expect(
      extractCompanyMatchParams({
        node: {
          ...COMPANY_NODE_MOCK,
          domainName: { primaryLinkUrl: 'https://www.acme.com/' },
          name: 'Acme',
        },
        input: INPUT,
      }),
    ).toEqual({ domain: 'acme.com', name: 'Acme', minMatchScore: undefined });
  });

  it('falls back to the name alone', () => {
    expect(
      extractCompanyMatchParams({
        node: { ...COMPANY_NODE_MOCK, domainName: null, name: 'Acme' },
        input: INPUT,
      }),
    ).toEqual({ name: 'Acme', minMatchScore: undefined });
  });

  it('honors an explicit minMatchScore from the input', () => {
    expect(
      extractCompanyMatchParams({
        node: { ...COMPANY_NODE_MOCK, name: 'Acme' },
        input: { records: [], minMatchScore: 70 },
      }),
    ).toMatchObject({ minMatchScore: 70 });
  });

  it('rejects a minMatchScore outside the Cognism range', () => {
    expect(() =>
      extractCompanyMatchParams({
        node: { ...COMPANY_NODE_MOCK, name: 'Acme' },
        input: { records: [], minMatchScore: -1 },
      }),
    ).toThrow('Minimum match score must be an integer between 0 and 100.');
  });

  it('returns undefined when there is no usable identifier', () => {
    expect(
      extractCompanyMatchParams({
        node: { ...COMPANY_NODE_MOCK, domainName: null, name: '' },
        input: INPUT,
      }),
    ).toBeUndefined();
  });
});
