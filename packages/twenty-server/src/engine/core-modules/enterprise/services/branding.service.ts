/* @license Enterprise */

import { Injectable } from '@nestjs/common';

import { isNonEmptyString } from '@sniptt/guards';
import { DEFAULT_BRAND } from 'twenty-shared/constants';
import { type Brand } from 'twenty-shared/types';

import { EnterprisePlanService } from 'src/engine/core-modules/enterprise/services/enterprise-plan.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

@Injectable()
export class BrandingService {
  constructor(
    private readonly twentyConfigService: TwentyConfigService,
    private readonly enterprisePlanService: EnterprisePlanService,
  ) {}

  // Only a valid Enterprise key unlocks branding; seat count and billing never do.
  getBrand(): Brand {
    const configuredBrand = this.getConfiguredBrand();

    if (
      !this.isCustomized(configuredBrand) ||
      !this.enterprisePlanService.isValid()
    ) {
      return DEFAULT_BRAND;
    }

    return { ...configuredBrand, isWhiteLabeled: true };
  }

  private getConfiguredBrand(): Omit<Brand, 'isWhiteLabeled'> {
    return {
      name: this.twentyConfigService.get('BRAND_NAME'),
      logoUrl: this.getOptional('BRAND_LOGO_URL'),
      faviconUrl: this.getOptional('BRAND_FAVICON_URL'),
      termsUrl: this.getOptional('BRAND_TERMS_URL'),
      privacyUrl: this.getOptional('BRAND_PRIVACY_URL'),
      dpaUrl: this.getOptional('BRAND_DPA_URL'),
      websiteUrl: this.twentyConfigService.get('BRAND_WEBSITE_URL'),
      docsUrl: this.twentyConfigService.get('BRAND_DOCS_URL'),
      supportEmail: this.getOptional('BRAND_SUPPORT_EMAIL'),
    };
  }

  private getOptional(
    key:
      | 'BRAND_LOGO_URL'
      | 'BRAND_FAVICON_URL'
      | 'BRAND_TERMS_URL'
      | 'BRAND_PRIVACY_URL'
      | 'BRAND_DPA_URL'
      | 'BRAND_SUPPORT_EMAIL',
  ): string | null {
    const value = this.twentyConfigService.get(key);

    return isNonEmptyString(value) ? value : null;
  }

  private isCustomized(brand: Omit<Brand, 'isWhiteLabeled'>): boolean {
    return (
      brand.name !== DEFAULT_BRAND.name ||
      brand.websiteUrl !== DEFAULT_BRAND.websiteUrl ||
      brand.docsUrl !== DEFAULT_BRAND.docsUrl ||
      [
        brand.logoUrl,
        brand.faviconUrl,
        brand.termsUrl,
        brand.privacyUrl,
        brand.dpaUrl,
        brand.supportEmail,
      ].some(isNonEmptyString)
    );
  }
}
