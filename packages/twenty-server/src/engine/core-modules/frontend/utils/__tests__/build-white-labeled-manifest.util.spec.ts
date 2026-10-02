import { DEFAULT_BRAND } from 'twenty-shared/constants';

import { buildWhiteLabeledManifest } from 'src/engine/core-modules/frontend/utils/build-white-labeled-manifest.util';

const BASE_MANIFEST = {
  short_name: 'Twenty',
  name: 'Twenty',
  start_url: '.',
  display: 'standalone',
  icons: [{ src: 'images/icons/android/android-launchericon-192-192.png' }],
};

const WHITE_LABELED_BRAND = {
  ...DEFAULT_BRAND,
  isWhiteLabeled: true,
  name: 'Acme CRM',
};

describe('buildWhiteLabeledManifest', () => {
  it('uses the brand name and icon', () => {
    expect(
      buildWhiteLabeledManifest(BASE_MANIFEST, {
        ...WHITE_LABELED_BRAND,
        faviconUrl: 'https://acme.test/icon.png',
      }),
    ).toEqual({
      ...BASE_MANIFEST,
      short_name: 'Acme CRM',
      name: 'Acme CRM',
      icons: [
        { src: 'https://acme.test/icon.png', sizes: '192x192' },
        { src: 'https://acme.test/icon.png', sizes: '512x512' },
      ],
    });
  });

  it('keeps the bundled icons when no brand image is set', () => {
    expect(
      buildWhiteLabeledManifest(BASE_MANIFEST, WHITE_LABELED_BRAND).icons,
    ).toEqual(BASE_MANIFEST.icons);
  });
});
