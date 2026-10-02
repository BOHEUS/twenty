import { brandState } from '@/client-config/states/brandState';
import { DEFAULT_WORKSPACE_LOGO } from '@/ui/navigation/navigation-drawer/constants/DefaultWorkspaceLogo';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const useDefaultWorkspaceLogo = (): string => {
  const brand = useAtomStateValue(brandState);

  return brand.logoUrl ?? DEFAULT_WORKSPACE_LOGO;
};
