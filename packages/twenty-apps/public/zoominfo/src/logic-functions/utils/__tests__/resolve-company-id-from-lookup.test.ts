import { describe, expect, it } from 'vitest';

import {
  buildCompanyLookupIndex,
  resolveCompanyIdFromLookup,
} from 'src/logic-functions/utils/resolve-company-id-from-lookup';
import { type CompanyLookupNode } from 'src/types/company-lookup-node';

const companies: CompanyLookupNode[] = [
  {
    id: 'acme',
    name: 'Acme',
    domainName: { primaryLinkUrl: 'https://www.acme.com' },
    linkedinLink: { primaryLinkUrl: 'https://www.linkedin.com/company/acme/' },
    zoomInfoCompanyId: '111',
  },
  { id: 'globex-one', name: 'Globex' },
  { id: 'globex-two', name: 'Globex' },
];

const index = buildCompanyLookupIndex(companies);

describe('resolveCompanyIdFromLookup', () => {
  it('prefers the ZoomInfo id over every weaker key', () => {
    expect(
      resolveCompanyIdFromLookup({
        matchKeys: { zoomInfoCompanyId: '111', name: 'Globex' },
        index,
      }),
    ).toBe('acme');
  });

  it('matches on a normalized domain', () => {
    expect(
      resolveCompanyIdFromLookup({ matchKeys: { website: 'acme.com' }, index }),
    ).toBe('acme');
  });

  it('matches on a normalized LinkedIn url', () => {
    expect(
      resolveCompanyIdFromLookup({
        matchKeys: { linkedinUrl: 'linkedin.com/company/acme' },
        index,
      }),
    ).toBe('acme');
  });

  it('refuses a name shared by more than one company', () => {
    expect(
      resolveCompanyIdFromLookup({ matchKeys: { name: 'Globex' }, index }),
    ).toBeUndefined();
  });

  it('accepts a name that resolves to exactly one company', () => {
    expect(
      resolveCompanyIdFromLookup({ matchKeys: { name: 'Acme' }, index }),
    ).toBe('acme');
  });

  it('resolves nothing when no key matches', () => {
    expect(
      resolveCompanyIdFromLookup({ matchKeys: { website: 'nope.com' }, index }),
    ).toBeUndefined();
  });
});
