import { describe, expect, it } from 'vitest';

import { mapCompany } from 'src/logic-functions/utils/map-company';

describe('mapCompany', () => {
  it('reads revenue as thousands of dollars', () => {
    const { standard } = mapCompany({ revenue: 100000 });

    expect(standard.annualRevenue).toEqual({
      amountMicros: 100_000_000_000_000,
      currencyCode: 'USD',
    });
  });

  it('reads funding amounts as whole dollars', () => {
    const { zoomInfo } = mapCompany({ totalFundingAmount: 2500000 });

    expect(zoomInfo.zoomInfoTotalFunding).toEqual({
      amountMicros: 2_500_000_000_000,
      currencyCode: 'USD',
    });
  });

  it('takes the LinkedIn entry out of socialMediaUrls', () => {
    const { standard } = mapCompany({
      socialMediaUrls: [
        { type: 'FACEBOOK', url: 'https://www.facebook.com/zoominfo' },
        { type: 'LINKED_IN', url: 'http://www.linkedin.com/company/zoominfo' },
      ],
    });

    expect(standard.linkedinLink).toEqual({
      primaryLinkUrl: 'linkedin.com/company/zoominfo',
      primaryLinkLabel: '',
      secondaryLinks: null,
    });
  });

  it('accepts a single-valued primary industry as well as a list', () => {
    expect(mapCompany({ primaryIndustry: 'Software' }).zoomInfo).toMatchObject({
      zoomInfoPrimaryIndustry: ['Software'],
    });
    expect(
      mapCompany({ primaryIndustry: ['Software', 'Software'] }).zoomInfo,
    ).toMatchObject({ zoomInfoPrimaryIndustry: ['Software'] });
  });

  it('drops a company type ZoomInfo did not document', () => {
    expect(mapCompany({ type: 'public' }).zoomInfo.zoomInfoCompanyType).toBe(
      'PUBLIC',
    );
    expect(
      mapCompany({ type: 'cooperative' }).zoomInfo.zoomInfoCompanyType,
    ).toBeUndefined();
  });

  it('stringifies the numeric ids', () => {
    const { zoomInfo } = mapCompany({ id: 344589814, ultimateParentId: 123 });

    expect(zoomInfo.zoomInfoCompanyId).toBe('344589814');
    expect(zoomInfo.zoomInfoUltimateParentId).toBe('123');
  });
});
