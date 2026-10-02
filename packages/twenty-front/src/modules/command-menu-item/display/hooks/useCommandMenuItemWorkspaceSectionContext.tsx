import { Avatar } from 'twenty-ui/primitives/data-display';

import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { type CommandMenuItemSectionContext } from '@/command-menu-item/types/CommandMenuItemSectionContext';
import { useDefaultWorkspaceLogo } from '@/ui/navigation/navigation-drawer/hooks/useDefaultWorkspaceLogo';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { getAbsoluteImageUrl } from '~/utils/image/getAbsoluteImageUrl';
import { getWorkspaceAvatarColorSeed } from '@/workspace/utils/getWorkspaceAvatarColorSeed';

export const useCommandMenuItemWorkspaceSectionContext =
  (): CommandMenuItemSectionContext => {
    const currentWorkspace = useAtomStateValue(currentWorkspaceState);
    const defaultWorkspaceLogo = useDefaultWorkspaceLogo();

    return {
      icon: (
        <Avatar
          size="md"
          name={currentWorkspace?.displayName ?? ''}
          colorSeed={getWorkspaceAvatarColorSeed(currentWorkspace?.displayName)}
          src={getAbsoluteImageUrl(
            currentWorkspace?.logo ?? defaultWorkspaceLogo,
          )}
        />
      ),
    };
  };
