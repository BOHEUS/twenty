import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { Callout } from 'twenty-ui/components';
import { IconInfoCircle } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledCalloutContainer = styled.div`
  margin-bottom: ${themeCssVariables.spacing[4]};
`;

export const ConfigVariableBrandingLockedCallout = () => {
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  if (currentWorkspace?.hasValidEnterpriseValidityToken === true) {
    return null;
  }

  return (
    <StyledCalloutContainer>
      <Callout
        variant="warning"
        Icon={IconInfoCircle}
        title={t`Branding requires an Enterprise key`}
        description={t`These values are ignored and Twenty branding is used until a valid Enterprise key is active.`}
      />
    </StyledCalloutContainer>
  );
};
