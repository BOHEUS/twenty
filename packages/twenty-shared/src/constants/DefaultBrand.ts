import { DOCUMENTATION_BASE_URL } from '@/constants/DocumentationBaseUrl';
import { type Brand } from '@/types/Brand';

export const DEFAULT_BRAND: Brand = {
  isWhiteLabeled: false,
  name: 'Twenty',
  logoUrl: null,
  faviconUrl: null,
  termsUrl: null,
  privacyUrl: null,
  dpaUrl: null,
  websiteUrl: 'https://twenty.com',
  docsUrl: DOCUMENTATION_BASE_URL,
  supportEmail: 'felix@twenty.com',
};
