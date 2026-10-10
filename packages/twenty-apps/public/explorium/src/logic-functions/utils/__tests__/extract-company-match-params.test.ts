import { describe, expect, it } from 'vitest';

import { COMPANY_NODE_MOCK } from 'src/logic-functions/__mocks__/company-node.mock';
import { extractCompanyMatchParams } from 'src/logic-functions/utils/extract-company-match-params';

describe('extractCompanyMatchParams', () => {
  it('reuses a stored Explorium business id instead of matching again', () => {
    expect(
      extractCompanyMatchParams({
        node: { ...COMPANY_NODE_MOCK, exploriumId: 'business-1' },
      }),
    ).toEqual({ exploriumId: 'business-1' });
  });

  it('matches on the normalized domain and sends the name along', () => {
    expect(
      extractCompanyMatchParams({
        node: {
          ...COMPANY_NODE_MOCK,
          name: 'Acme',
          domainName: { primaryLinkUrl: 'https://www.Acme.com/about' },
        },
      }),
    ).toEqual({ matchInput: { name: 'Acme', domain: 'acme.com' } });
  });

  it('matches on the LinkedIn URL', () => {
    expect(
      extractCompanyMatchParams({
        node: {
          ...COMPANY_NODE_MOCK,
          domainName: null,
          linkedinLink: {
            primaryLinkUrl: 'https://www.linkedin.com/company/acme',
          },
        },
      }),
    ).toEqual({
      matchInput: { linkedin_url: 'https://www.linkedin.com/company/acme' },
    });
  });

  it('skips a company that only has a name', () => {
    expect(
      extractCompanyMatchParams({
        node: { ...COMPANY_NODE_MOCK, name: 'Acme', domainName: null },
      }),
    ).toBeUndefined();
  });
});
