import { describe, expect, it } from 'vitest';

import { HUNTER_COMPANY_DATA_MOCK } from 'src/logic-functions/__mocks__/hunter-company-data.mock';
import { hasCoreCompanyData } from 'src/logic-functions/utils/has-core-company-data';

describe('hasCoreCompanyData', () => {
  it('needs a name, a category, a location and a size', () => {
    expect(hasCoreCompanyData(HUNTER_COMPANY_DATA_MOCK)).toBe(true);
    expect(
      hasCoreCompanyData({ ...HUNTER_COMPANY_DATA_MOCK, metrics: {} }),
    ).toBe(false);
    expect(hasCoreCompanyData(undefined)).toBe(false);
  });

  it('accepts tags in place of a category', () => {
    expect(
      hasCoreCompanyData({
        name: 'Acme',
        tags: ['B2B'],
        location: 'Austin',
        metrics: { employees: '1-10' },
      }),
    ).toBe(true);
  });
});
