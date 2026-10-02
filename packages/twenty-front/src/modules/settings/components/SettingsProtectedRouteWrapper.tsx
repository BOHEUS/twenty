import { WorkspaceRouteUnavailable } from '@/app/routing/components/WorkspaceRouteUnavailable';
import { useIsLogged } from '@/auth/hooks/useIsLogged';
import { brandState } from '@/client-config/states/brandState';
import { useHasPermissionFlag } from '@/settings/roles/hooks/useHasPermissionFlag';
import { useWorkspaceSurface } from '@/ui/layout/hooks/useWorkspaceSurface';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { Trans } from '@lingui/react/macro';
import { type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { SettingsPath } from 'twenty-shared/types';
import { getSettingsPath } from 'twenty-shared/utils';
import {
  type FeatureFlagKey,
  type PermissionFlagType,
} from '~/generated-metadata/graphql';

type SettingsProtectedRouteWrapperProps = {
  children?: ReactNode;
  settingsPermission?: PermissionFlagType;
  requiredFeatureFlag?: FeatureFlagKey;
  isUnavailableWhenWhiteLabeled?: boolean;
};

export const SettingsProtectedRouteWrapper = ({
  children,
  settingsPermission,
  requiredFeatureFlag,
  isUnavailableWhenWhiteLabeled = false,
}: SettingsProtectedRouteWrapperProps) => {
  const isLogged = useIsLogged();
  const hasPermission = useHasPermissionFlag(settingsPermission);
  const requiredFeatureFlagEnabled = useIsFeatureEnabled(
    requiredFeatureFlag || null,
  );
  const workspaceSurface = useWorkspaceSurface();
  const brand = useAtomStateValue(brandState);

  if (!isLogged) {
    return null;
  }

  // TODO: move into PageChangeEffect to avoid conflicting and repeated redirects
  if (
    (requiredFeatureFlag && !requiredFeatureFlagEnabled) ||
    !hasPermission ||
    (isUnavailableWhenWhiteLabeled && brand.isWhiteLabeled)
  ) {
    if (workspaceSurface.type === 'side-panel') {
      return (
        <WorkspaceRouteUnavailable>
          <Trans>You don't have access to this settings page.</Trans>
        </WorkspaceRouteUnavailable>
      );
    }

    return <Navigate to={getSettingsPath(SettingsPath.ProfilePage)} replace />;
  }

  return children ?? <Outlet />;
};
