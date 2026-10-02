import {
  DOCUMENTATION_BASE_URL,
  DOCUMENTATION_DEFAULT_LANGUAGE,
  DOCUMENTATION_DEFAULT_PATH,
  DOCUMENTATION_SUPPORTED_LANGUAGES,
  type DocumentationPath,
} from 'twenty-shared/constants';

export const getDocumentationUrl = ({
  docsUrl,
  locale,
  path = DOCUMENTATION_DEFAULT_PATH,
}: {
  docsUrl: string;
  locale?: string | null;
  path?: DocumentationPath | string;
}): string => {
  // Paths and locales only exist on Twenty's documentation, so a custom docs site gets its root.
  if (docsUrl !== DOCUMENTATION_BASE_URL) {
    return docsUrl;
  }

  if (!locale) {
    return `${DOCUMENTATION_BASE_URL}${path}`;
  }

  const langCode = locale.split('-')[0].toLowerCase();

  // English content is served at root path (no /en/ prefix)
  if (langCode === DOCUMENTATION_DEFAULT_LANGUAGE) {
    return `${DOCUMENTATION_BASE_URL}${path}`;
  }

  const isSupported = DOCUMENTATION_SUPPORTED_LANGUAGES.includes(
    langCode as (typeof DOCUMENTATION_SUPPORTED_LANGUAGES)[number],
  );

  if (isSupported) {
    return `${DOCUMENTATION_BASE_URL}/${langCode}${path}`;
  }

  return `${DOCUMENTATION_BASE_URL}${path}`;
};
