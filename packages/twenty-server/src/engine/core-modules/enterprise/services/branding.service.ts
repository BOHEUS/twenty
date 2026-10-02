/* @license Enterprise */

import { Injectable } from '@nestjs/common';

import { isNonEmptyString } from '@sniptt/guards';
import { type Brand } from 'twenty-shared/types';

import { EnterprisePlanService } from 'src/engine/core-modules/enterprise/services/enterprise-plan.service';
import { resolveBrand } from 'src/engine/core-modules/enterprise/utils/resolve-brand.util';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

@Injectable()
export class BrandingService {
  constructor(
    private readonly twentyConfigService: TwentyConfigService,
    private readonly enterprisePlanService: EnterprisePlanService,
  ) {}

  getBrand(): Brand {
    return resolveBrand({
      configuredBrand: {
        name: this.twentyConfigService.get('BRAND_NAME'),
        logoUrl: this.getOptionalConfigValue('BRAND_LOGO_URL'),
        faviconUrl: this.getOptionalConfigValue('BRAND_FAVICON_URL'),
        termsUrl: this.getOptionalConfigValue('BRAND_TERMS_URL'),
        privacyUrl: this.getOptionalConfigValue('BRAND_PRIVACY_URL'),
        dpaUrl: this.getOptionalConfigValue('BRAND_DPA_URL'),
        websiteUrl: this.twentyConfigService.get('BRAND_WEBSITE_URL'),
        docsUrl: this.twentyConfigService.get('BRAND_DOCS_URL'),
        supportEmail: this.getOptionalConfigValue('BRAND_SUPPORT_EMAIL'),
      },
      hasValidEnterprisePlan: this.enterprisePlanService.isValid(),
    });
  }

  // The help center search reaches Twenty's documentation unless the operator points it at their own Mintlify site.
  isHelpCenterSearchAvailable(): boolean {
    return (
      !this.getBrand().isWhiteLabeled ||
      isNonEmptyString(this.twentyConfigService.get('MINTLIFY_SUBDOMAIN'))
    );
  }

  private getOptionalConfigValue(
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
}
