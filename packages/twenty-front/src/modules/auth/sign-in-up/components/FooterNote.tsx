import { styled } from '@linaria/react';
import { Trans, useLingui } from '@lingui/react/macro';

import { useWorkspaceBypass } from '@/auth/sign-in-up/hooks/useWorkspaceBypass';
import { getBrandLegalUrl } from '@/auth/utils/getBrandLegalUrl';
import { brandState } from '@/client-config/states/brandState';
import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { Fragment } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledCopyContainer = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.4;
  max-width: ${ONBOARDING_CONTENT_BLOCK_WIDTH}px;
  text-align: center;

  & > a {
    color: ${themeCssVariables.font.color.tertiary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const StyledLinksContainer = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  flex-wrap: nowrap;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]};
  justify-content: center;
  max-width: 100%;
  text-align: center;
  white-space: nowrap;

  & > a,
  & > button {
    background: none;
    border: none;
    color: ${themeCssVariables.font.color.tertiary};
    cursor: pointer;
    font: inherit;
    padding: 0;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const StyledSeparator = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
`;

type FooterNoteProps = {
  secondaryAgreement?: 'privacyPolicy' | 'dataProcessingAgreement';
};

export const FooterNote = ({
  secondaryAgreement = 'privacyPolicy',
}: FooterNoteProps) => {
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();
  const { i18n } = useLingui();
  const brand = useAtomStateValue(brandState);

  const { shouldOfferBypass, shouldUseBypass, enableBypass } =
    useWorkspaceBypass();

  const termsUrl = getBrandLegalUrl({
    brand,
    locale: i18n.locale,
    page: 'terms',
  });
  const privacyUrl = getBrandLegalUrl({
    brand,
    locale: i18n.locale,
    page: 'privacy',
  });
  const dpaUrl = getBrandLegalUrl({ brand, locale: i18n.locale, page: 'dpa' });

  const isDataProcessingAgreement =
    secondaryAgreement === 'dataProcessingAgreement';
  const secondaryAgreementUrl = isDataProcessingAgreement ? dpaUrl : privacyUrl;
  const brandName = brand.name;

  if (!isOnAWorkspace) {
    if (!isDefined(termsUrl) || !isDefined(secondaryAgreementUrl)) {
      return null;
    }

    return (
      <StyledCopyContainer>
        <Trans>By using {brandName}, you agree to the</Trans>{' '}
        <a href={termsUrl} target="_blank" rel="noopener noreferrer">
          <Trans>Terms of Service</Trans>
        </a>{' '}
        <Trans>and</Trans>{' '}
        <a
          href={secondaryAgreementUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {isDataProcessingAgreement ? (
            <Trans>Data Processing Agreement</Trans>
          ) : (
            <Trans>Privacy Policy</Trans>
          )}
        </a>
        .
      </StyledCopyContainer>
    );
  }

  const links = [
    shouldOfferBypass && !shouldUseBypass && (
      <button type="button" onClick={enableBypass}>
        <Trans>Bypass SSO</Trans>
      </button>
    ),
    isDefined(privacyUrl) && (
      <a href={privacyUrl} target="_blank" rel="noopener noreferrer">
        <Trans>Privacy Policy</Trans>
      </a>
    ),
    isDefined(termsUrl) && (
      <a href={termsUrl} target="_blank" rel="noopener noreferrer">
        <Trans>Terms of Service</Trans>
      </a>
    ),
  ].filter(Boolean);

  if (links.length === 0) {
    return null;
  }

  return (
    <StyledLinksContainer>
      {links.map((link, index) => (
        <Fragment key={index}>
          {index > 0 && <StyledSeparator>•</StyledSeparator>}
          {link}
        </Fragment>
      ))}
    </StyledLinksContainer>
  );
};
