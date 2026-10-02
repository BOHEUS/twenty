import { DEFAULT_BRAND } from 'twenty-shared/constants';

import { resolveBrand } from 'src/engine/core-modules/enterprise/utils/resolve-brand.util';

const TWENTY_CONFIGURED_BRAND = {
  name: DEFAULT_BRAND.name,
  logoUrl: null,
  faviconUrl: null,
  termsUrl: null,
  privacyUrl: null,
  dpaUrl: null,
  websiteUrl: DEFAULT_BRAND.websiteUrl,
  docsUrl: DEFAULT_BRAND.docsUrl,
  supportEmail: null,
};

const ACME_CONFIGURED_BRAND = {
  name: 'Acme CRM',
  logoUrl: 'https://acme.test/logo.png',
  faviconUrl: 'https://acme.test/favicon.png',
  termsUrl: 'https://acme.test/terms',
  privacyUrl: 'https://acme.test/privacy',
  dpaUrl: 'https://acme.test/dpa',
  websiteUrl: 'https://acme.test',
  docsUrl: 'https://docs.acme.test',
  supportEmail: 'help@acme.test',
};

describe('resolveBrand', () => {
  it('returns the configured brand with a valid Enterprise key', () => {
    expect(
      resolveBrand({
        configuredBrand: ACME_CONFIGURED_BRAND,
        hasValidEnterprisePlan: true,
      }),
    ).toEqual({ ...ACME_CONFIGURED_BRAND, isWhiteLabeled: true });
  });

  it('returns the Twenty brand without a valid Enterprise key, including after a lapse', () => {
    expect(
      resolveBrand({
        configuredBrand: ACME_CONFIGURED_BRAND,
        hasValidEnterprisePlan: false,
      }),
    ).toEqual(DEFAULT_BRAND);
  });

  it('keeps Twenty defaults and leaves Twenty-owned values unset on a partial config', () => {
    expect(
      resolveBrand({
        configuredBrand: { ...TWENTY_CONFIGURED_BRAND, name: 'Acme CRM' },
        hasValidEnterprisePlan: true,
      }),
    ).toEqual({
      ...TWENTY_CONFIGURED_BRAND,
      name: 'Acme CRM',
      isWhiteLabeled: true,
    });
  });

  it('is not white-labeled when nothing differs from Twenty', () => {
    expect(
      resolveBrand({
        configuredBrand: TWENTY_CONFIGURED_BRAND,
        hasValidEnterprisePlan: true,
      }),
    ).toEqual(DEFAULT_BRAND);
  });
});
