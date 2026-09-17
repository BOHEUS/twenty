import { describe, expect, it } from 'vitest';

import { buildCompanySearchItem } from 'src/logic-functions/utils/build-company-search-item';

describe('buildCompanySearchItem', () => {
  it('should look a company up by the Lusha id it already has', () => {
    expect(
      buildCompanySearchItem({
        id: 'company-1',
        lushaId: '16303253',
        domainName: { primaryLinkUrl: 'lusha.com' },
      }),
    ).toEqual({ clientReferenceId: 'company-1', id: '16303253' });
  });

  it('should match a company on its normalized domain', () => {
    expect(
      buildCompanySearchItem({
        id: 'company-1',
        name: 'Lusha',
        domainName: { primaryLinkUrl: 'https://www.Lusha.com/pricing' },
      }),
    ).toEqual({ clientReferenceId: 'company-1', domain: 'lusha.com' });
  });

  it('should skip a company that only has a name', () => {
    expect(
      buildCompanySearchItem({ id: 'company-1', name: 'Lusha' }),
    ).toBeUndefined();
  });
});
