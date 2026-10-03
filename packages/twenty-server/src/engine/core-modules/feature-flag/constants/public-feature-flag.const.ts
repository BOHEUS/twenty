import { FeatureFlagKey } from 'twenty-shared/types';

type FeatureFlagMetadata = {
  label: string;
  description: string;
  icon: string;
  imagePath?: string;
};

export type PublicFeatureFlag = {
  key: FeatureFlagKey;
  metadata: FeatureFlagMetadata;
};

export const PUBLIC_FEATURE_FLAGS: PublicFeatureFlag[] = [
  {
    key: FeatureFlagKey.IS_MAP_VIEW_ENABLED,
    metadata: {
      label: 'Map View',
      description: 'Display records on a map based on their address',
      icon: 'IconMap',
    },
  },
  ...(process.env.CLOUDFLARE_API_KEY
    ? [
        // {
        // Here you can add cloud only feature flags
        // },
      ]
    : []),
];
