import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { render, screen } from '@testing-library/react';
import { Provider as JotaiProvider } from 'jotai';
import { DEFAULT_BRAND } from 'twenty-shared/constants';
import { SOURCE_LOCALE } from 'twenty-shared/translations';

import { FooterNote } from '@/auth/sign-in-up/components/FooterNote';
import { brandState } from '@/client-config/states/brandState';
import {
  jotaiStore,
  resetJotaiStore,
} from '@/ui/utilities/state/jotai/jotaiStore';
import { dynamicActivate } from '~/utils/i18n/dynamicActivate';

let isOnAWorkspaceValue = false;

jest.mock('@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace', () => ({
  useIsCurrentLocationOnAWorkspace: () => ({
    isOnAWorkspace: isOnAWorkspaceValue,
  }),
}));

const WHITE_LABELED_BRAND = {
  ...DEFAULT_BRAND,
  isWhiteLabeled: true,
  name: 'Acme CRM',
  websiteUrl: 'https://acme.test',
};

const renderFooterNote = () =>
  render(
    <JotaiProvider store={jotaiStore}>
      <I18nProvider i18n={i18n}>
        <FooterNote secondaryAgreement="dataProcessingAgreement" />
      </I18nProvider>
    </JotaiProvider>,
  );

describe('FooterNote', () => {
  beforeAll(() => {
    dynamicActivate(SOURCE_LOCALE);
  });

  beforeEach(() => {
    resetJotaiStore();
    isOnAWorkspaceValue = false;
  });

  it('links to the Twenty legal pages by default', () => {
    renderFooterNote();

    expect(screen.getByText(/By using Twenty/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Terms of Service' }),
    ).toHaveAttribute('href', 'https://twenty.com/terms');
    expect(
      screen.getByRole('link', { name: 'Data Processing Agreement' }),
    ).toHaveAttribute('href', 'https://twenty.com/legal/dpa');
  });

  it('uses the configured brand and legal pages when white-labeled', () => {
    jotaiStore.set(brandState.atom, {
      ...WHITE_LABELED_BRAND,
      termsUrl: 'https://acme.test/terms',
      dpaUrl: 'https://acme.test/dpa',
    });

    renderFooterNote();

    expect(screen.getByText(/By using Acme CRM/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Terms of Service' }),
    ).toHaveAttribute('href', 'https://acme.test/terms');
    expect(
      screen.getByRole('link', { name: 'Data Processing Agreement' }),
    ).toHaveAttribute('href', 'https://acme.test/dpa');
  });

  it('hides the agreement sentence when the white-labeled legal pages are unset', () => {
    jotaiStore.set(brandState.atom, WHITE_LABELED_BRAND);

    renderFooterNote();

    expect(screen.queryByText(/By using/)).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('shows only the configured links on a white-labeled workspace', () => {
    isOnAWorkspaceValue = true;
    jotaiStore.set(brandState.atom, {
      ...WHITE_LABELED_BRAND,
      privacyUrl: 'https://acme.test/privacy',
    });

    renderFooterNote();

    expect(
      screen.getByRole('link', { name: 'Privacy Policy' }),
    ).toHaveAttribute('href', 'https://acme.test/privacy');
    expect(
      screen.queryByRole('link', { name: 'Terms of Service' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('•')).not.toBeInTheDocument();
  });
});
