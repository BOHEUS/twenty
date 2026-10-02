import {
  DOCUMENTATION_DEFAULT_LANGUAGE,
  DOCUMENTATION_SUPPORTED_LANGUAGES,
  type DocumentationSupportedLanguage,
} from 'twenty-shared/constants';
import { type Brand } from 'twenty-shared/types';

type LegalPage = 'terms' | 'privacy' | 'dpa';

const TWENTY_LEGAL_PATHS: Record<LegalPage, string> = {
  terms: '/terms',
  privacy: '/privacy-policy',
  dpa: '/legal/dpa',
};

const getLocalizedTwentyPath = (locale: string, path: string) => {
  const language = new Intl.Locale(locale).language;

  const isLocalizedWebsitePath =
    language !== DOCUMENTATION_DEFAULT_LANGUAGE &&
    DOCUMENTATION_SUPPORTED_LANGUAGES.some(
      (supportedLanguage: DocumentationSupportedLanguage) =>
        supportedLanguage === language,
    );

  return isLocalizedWebsitePath ? `/${language}${path}` : path;
};

// A white-labeled instance never links to Twenty's legal pages: an unset page stays unset.
export const getBrandLegalUrl = ({
  brand,
  locale,
  page,
}: {
  brand: Brand;
  locale: string;
  page: LegalPage;
}): string | null => {
  if (brand.isWhiteLabeled) {
    const configuredUrlByPage: Record<LegalPage, string | null> = {
      terms: brand.termsUrl,
      privacy: brand.privacyUrl,
      dpa: brand.dpaUrl,
    };

    return configuredUrlByPage[page];
  }

  const path =
    page === 'dpa'
      ? TWENTY_LEGAL_PATHS.dpa
      : getLocalizedTwentyPath(locale, TWENTY_LEGAL_PATHS[page]);

  return new URL(path, brand.websiteUrl).toString();
};
