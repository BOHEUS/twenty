import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import {
  StyledContainer,
  StyledIconChevronDown,
  StyledLabel,
  StyledLabelWrapper,
} from '@/ui/navigation/navigation-drawer/components/MultiWorkspaceDropdown/internal/MultiWorkspacesDropdownStyles';
import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { useDefaultWorkspaceLogo } from '@/ui/navigation/navigation-drawer/hooks/useDefaultWorkspaceLogo';
import { useIsNavigationDrawerContentExpanded } from '@/navigation/hooks/useIsNavigationDrawerContentExpanded';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { getWorkspaceAvatarColorSeed } from '@/workspace/utils/getWorkspaceAvatarColorSeed';
import { getAbsoluteImageUrl } from '~/utils/image/getAbsoluteImageUrl';
import { Avatar } from 'twenty-ui/primitives/data-display';
import { useTheme } from 'twenty-ui/theme';

type MultiWorkspaceDropdownClickableComponentProps = {
  disabled?: boolean;
  shouldHideLabel?: boolean;
};

export const MultiWorkspaceDropdownClickableComponent = ({
  disabled,
  shouldHideLabel = false,
}: MultiWorkspaceDropdownClickableComponentProps) => {
  const theme = useTheme();
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const defaultWorkspaceLogo = useDefaultWorkspaceLogo();

  const isNavigationDrawerExpanded = useIsNavigationDrawerContentExpanded();
  return (
    <StyledContainer
      data-testid="workspace-dropdown"
      isNavigationDrawerExpanded={isNavigationDrawerExpanded}
      disabled={disabled}
    >
      <Avatar
        name={currentWorkspace?.displayName || ''}
        colorSeed={getWorkspaceAvatarColorSeed(currentWorkspace?.displayName)}
        src={getAbsoluteImageUrl(
          currentWorkspace?.logo ?? defaultWorkspaceLogo,
        )}
      />
      {!shouldHideLabel && (
        <>
          <StyledLabelWrapper>
            <NavigationDrawerAnimatedCollapseWrapper>
              <StyledLabel>{currentWorkspace?.displayName ?? ''}</StyledLabel>
            </NavigationDrawerAnimatedCollapseWrapper>
          </StyledLabelWrapper>
          <NavigationDrawerAnimatedCollapseWrapper>
            <StyledIconChevronDown
              size={theme.icon.size.md}
              stroke={theme.icon.stroke.sm}
            />
          </NavigationDrawerAnimatedCollapseWrapper>
        </>
      )}
    </StyledContainer>
  );
};
