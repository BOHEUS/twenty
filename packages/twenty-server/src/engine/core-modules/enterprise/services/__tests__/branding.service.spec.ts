import { DEFAULT_BRAND } from 'twenty-shared/constants';

import { type ConfigVariables } from 'src/engine/core-modules/twenty-config/config-variables';
import { type EnterprisePlanService } from 'src/engine/core-modules/enterprise/services/enterprise-plan.service';
import { BrandingService } from 'src/engine/core-modules/enterprise/services/branding.service';
import { type TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

const DEFAULT_CONFIG: Partial<ConfigVariables> = {
  BRAND_NAME: DEFAULT_BRAND.name,
  BRAND_WEBSITE_URL: DEFAULT_BRAND.websiteUrl,
  BRAND_DOCS_URL: DEFAULT_BRAND.docsUrl,
};

const FULL_CONFIG: Partial<ConfigVariables> = {
  BRAND_NAME: 'Acme CRM',
  BRAND_LOGO_URL: 'https://acme.test/logo.png',
  BRAND_FAVICON_URL: 'https://acme.test/favicon.png',
  BRAND_TERMS_URL: 'https://acme.test/terms',
  BRAND_PRIVACY_URL: 'https://acme.test/privacy',
  BRAND_DPA_URL: 'https://acme.test/dpa',
  BRAND_WEBSITE_URL: 'https://acme.test',
  BRAND_DOCS_URL: 'https://docs.acme.test',
  BRAND_SUPPORT_EMAIL: 'help@acme.test',
};

const buildService = ({
  config,
  isValid,
}: {
  config: Partial<ConfigVariables>;
  isValid: jest.Mock;
}) =>
  new BrandingService(
    {
      get: (key: keyof ConfigVariables) => config[key],
    } as unknown as TwentyConfigService,
    { isValid } as unknown as EnterprisePlanService,
  );

describe('BrandingService', () => {
  it('returns the configured brand when the Enterprise key is valid', () => {
    const service = buildService({
      config: FULL_CONFIG,
      isValid: jest.fn().mockReturnValue(true),
    });

    expect(service.getBrand()).toEqual({
      isWhiteLabeled: true,
      name: 'Acme CRM',
      logoUrl: 'https://acme.test/logo.png',
      faviconUrl: 'https://acme.test/favicon.png',
      termsUrl: 'https://acme.test/terms',
      privacyUrl: 'https://acme.test/privacy',
      dpaUrl: 'https://acme.test/dpa',
      websiteUrl: 'https://acme.test',
      docsUrl: 'https://docs.acme.test',
      supportEmail: 'help@acme.test',
    });
  });

  it('returns the Twenty brand when there is no valid Enterprise key', () => {
    const service = buildService({
      config: FULL_CONFIG,
      isValid: jest.fn().mockReturnValue(false),
    });

    expect(service.getBrand()).toEqual(DEFAULT_BRAND);
  });

  it('falls back to the Twenty brand as soon as the key lapses', () => {
    const isValid = jest.fn().mockReturnValueOnce(true).mockReturnValue(false);
    const service = buildService({ config: FULL_CONFIG, isValid });

    expect(service.getBrand().isWhiteLabeled).toBe(true);
    expect(service.getBrand()).toEqual(DEFAULT_BRAND);
  });

  it('keeps Twenty defaults for unset values and drops Twenty-owned ones', () => {
    const service = buildService({
      config: { ...DEFAULT_CONFIG, BRAND_NAME: 'Acme CRM', BRAND_LOGO_URL: '' },
      isValid: jest.fn().mockReturnValue(true),
    });

    expect(service.getBrand()).toEqual({
      isWhiteLabeled: true,
      name: 'Acme CRM',
      logoUrl: null,
      faviconUrl: null,
      termsUrl: null,
      privacyUrl: null,
      dpaUrl: null,
      websiteUrl: DEFAULT_BRAND.websiteUrl,
      docsUrl: DEFAULT_BRAND.docsUrl,
      supportEmail: null,
    });
  });

  it('is not white-labeled when nothing differs from Twenty', () => {
    const isValid = jest.fn().mockReturnValue(true);
    const service = buildService({ config: DEFAULT_CONFIG, isValid });

    expect(service.getBrand()).toEqual(DEFAULT_BRAND);
  });
});
