import { type Brand } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

const WHITE_LABELED_ICON_SIZES = ['192x192', '512x512'];

// One square icon of at least 512px covers the sizes browsers require to install the app.
export const buildWhiteLabeledManifest = (
  baseManifest: Record<string, unknown>,
  brand: Brand,
): Record<string, unknown> => {
  const iconUrl = brand.faviconUrl ?? brand.logoUrl;

  return {
    ...baseManifest,
    name: brand.name,
    short_name: brand.name,
    ...(isDefined(iconUrl) && {
      icons: WHITE_LABELED_ICON_SIZES.map((sizes) => ({
        src: iconUrl,
        sizes,
      })),
    }),
  };
};
