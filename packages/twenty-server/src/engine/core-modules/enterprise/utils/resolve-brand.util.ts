/* @license Enterprise */

import { isNonEmptyString } from '@sniptt/guards';
import { DEFAULT_BRAND } from 'twenty-shared/constants';
import { type Brand } from 'twenty-shared/types';

type ResolveBrandArgs = {
  configuredBrand: Omit<Brand, 'isWhiteLabeled'>;
  hasValidEnterprisePlan: boolean;
};

const isCustomized = (brand: Omit<Brand, 'isWhiteLabeled'>): boolean =>
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
  ].some(isNonEmptyString);

// Only a valid Enterprise key unlocks branding; seat count and billing never do.
export const resolveBrand = ({
  configuredBrand,
  hasValidEnterprisePlan,
}: ResolveBrandArgs): Brand =>
  hasValidEnterprisePlan && isCustomized(configuredBrand)
    ? { ...configuredBrand, isWhiteLabeled: true }
    : DEFAULT_BRAND;
