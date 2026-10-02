import { DEFAULT_BRAND } from 'twenty-shared/constants';

import { applyBrandToFrontendHtml } from 'src/engine/core-modules/frontend/utils/apply-brand-to-frontend-html.util';

const TEMPLATE = `<head>
    <link
      rel="icon"
      type="image/x-icon"
      href="/images/icons/android/android-launchericon-48-48.png"
      data-rh="true"
    />
    <link rel="apple-touch-icon" href="/images/icons/ios/192.png" />
    <meta
      property="og:image"
      content="https://raw.githubusercontent.com/twentyhq/twenty/main/docs/static/img/social-card.png"
    />
    <meta property="og:title" content="Twenty" />
    <meta
      name="twitter:image"
      content="https://raw.githubusercontent.com/twentyhq/twenty/main/docs/static/img/social-card.png"
    />
    <meta name="twitter:title" content="Twenty" />
    <title>Twenty</title>
</head>`;

const WHITE_LABELED_BRAND = {
  ...DEFAULT_BRAND,
  isWhiteLabeled: true,
  name: 'Acme <CRM>',
};

describe('applyBrandToFrontendHtml', () => {
  it('leaves the template untouched without white-labeling', () => {
    expect(applyBrandToFrontendHtml(TEMPLATE, DEFAULT_BRAND)).toBe(TEMPLATE);
  });

  it('replaces the titles, social images and icons with the brand', () => {
    const html = applyBrandToFrontendHtml(TEMPLATE, {
      ...WHITE_LABELED_BRAND,
      logoUrl: 'https://acme.test/logo.png',
      faviconUrl: 'https://acme.test/favicon.png',
    });

    expect(html).toContain('<title>Acme &lt;CRM&gt;</title>');
    expect(html).toContain(
      '<meta property="og:title" content="Acme &lt;CRM&gt;" />',
    );
    expect(html).toContain(
      '<meta name="twitter:title" content="Acme &lt;CRM&gt;" />',
    );
    expect(html).toContain(
      '<meta property="og:image" content="https://acme.test/logo.png" />',
    );
    expect(html).toContain('href="https://acme.test/favicon.png"\n');
    expect(html).toContain(
      '<link rel="apple-touch-icon" href="https://acme.test/favicon.png" />',
    );
    expect(html).not.toMatch(/Twenty|twentyhq/);
  });

  it('drops the Twenty social card and keeps the bundled icons without brand images', () => {
    const html = applyBrandToFrontendHtml(TEMPLATE, WHITE_LABELED_BRAND);

    expect(html).not.toContain('social-card.png');
    expect(html).toContain('android-launchericon-48-48.png');
  });
});
