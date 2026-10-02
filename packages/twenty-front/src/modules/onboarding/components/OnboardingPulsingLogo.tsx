import { brandState } from '@/client-config/states/brandState';
import { TWENTY_ONBOARDING_LOGO_URL } from '@/onboarding/constants/TwentyOnboardingLogoUrl';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledLogo = styled.img`
  animation: onboardingPulsingLogo 0.8s ease-in-out infinite alternate;
  height: ${themeCssVariables.spacing[12]};
  margin-bottom: ${themeCssVariables.spacing[8]};
  width: ${themeCssVariables.spacing[12]};

  @keyframes onboardingPulsingLogo {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.4;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`;

export const OnboardingPulsingLogo = () => {
  const brand = useAtomStateValue(brandState);

  return (
    <StyledLogo src={brand.logoUrl ?? TWENTY_ONBOARDING_LOGO_URL} alt="" />
  );
};
