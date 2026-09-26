import { mapStyleUrlsState } from '@/client-config/states/mapStyleUrlsState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { FeatureFlagKey } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

export const useIsMapViewEnabled = () => {
  const isMapViewFeatureEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_MAP_VIEW_ENABLED,
  );
  const mapStyleUrls = useAtomStateValue(mapStyleUrlsState);

  return isMapViewFeatureEnabled && isDefined(mapStyleUrls);
};
