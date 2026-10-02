import { type Brand } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { escapeHtml } from 'src/engine/core-modules/emailing-domain/utils/escape-html.util';

type MetaTagReplacement = {
  attribute: 'name' | 'property';
  key: string;
  content: string | null;
};

const replaceMetaTag = (
  html: string,
  { attribute, key, content }: MetaTagReplacement,
): string =>
  html.replace(
    new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*/>`),
    () =>
      isDefined(content)
        ? `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`
        : '',
  );

const replaceLinkHref = (html: string, rel: string, href: string): string =>
  html.replace(
    new RegExp(`(<link\\s+rel="${rel}"[^>]*?href=")[^"]*(")`),
    (_match, prefix: string, suffix: string) =>
      `${prefix}${escapeHtml(href)}${suffix}`,
  );

// Twenty's social card is dropped rather than kept when no brand logo is set.
export const applyBrandToFrontendHtml = (
  html: string,
  brand: Brand,
): string => {
  if (!brand.isWhiteLabeled) {
    return html;
  }

  const metaTagReplacements: MetaTagReplacement[] = [
    { attribute: 'property', key: 'og:title', content: brand.name },
    { attribute: 'name', key: 'twitter:title', content: brand.name },
    { attribute: 'property', key: 'og:image', content: brand.logoUrl },
    { attribute: 'name', key: 'twitter:image', content: brand.logoUrl },
  ];

  const brandedHtml = metaTagReplacements.reduce(
    replaceMetaTag,
    html.replace(
      /<title>[^<]*<\/title>/,
      () => `<title>${escapeHtml(brand.name)}</title>`,
    ),
  );

  const iconUrl = brand.faviconUrl ?? brand.logoUrl;

  if (!isDefined(iconUrl)) {
    return brandedHtml;
  }

  return ['icon', 'apple-touch-icon'].reduce(
    (currentHtml, rel) => replaceLinkHref(currentHtml, rel, iconUrl),
    brandedHtml,
  );
};
