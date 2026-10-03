import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { render, screen } from '@testing-library/react';
import { Provider as JotaiProvider } from 'jotai';
import { SOURCE_LOCALE } from 'twenty-shared/translations';

import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { ConfigVariableBrandingLockedCallout } from '@/settings/admin-panel/config-variables/components/ConfigVariableBrandingLockedCallout';
import {
  jotaiStore,
  resetJotaiStore,
} from '@/ui/utilities/state/jotai/jotaiStore';
import { mockCurrentWorkspace } from '~/testing/mock-data/users';
import { dynamicActivate } from '~/utils/i18n/dynamicActivate';

const renderCallout = () =>
  render(
    <JotaiProvider store={jotaiStore}>
      <I18nProvider i18n={i18n}>
        <ConfigVariableBrandingLockedCallout />
      </I18nProvider>
    </JotaiProvider>,
  );

describe('ConfigVariableBrandingLockedCallout', () => {
  beforeAll(() => {
    dynamicActivate(SOURCE_LOCALE);
  });

  beforeEach(() => {
    resetJotaiStore();
  });

  it('explains that branding is ignored without a valid Enterprise key', () => {
    jotaiStore.set(currentWorkspaceState.atom, {
      ...mockCurrentWorkspace,
      hasValidEnterpriseValidityToken: false,
    });

    renderCallout();

    expect(
      screen.getByText('Branding requires an Enterprise key'),
    ).toBeInTheDocument();
  });

  it('stays hidden with a valid Enterprise key', () => {
    jotaiStore.set(currentWorkspaceState.atom, {
      ...mockCurrentWorkspace,
      hasValidEnterpriseValidityToken: true,
    });

    renderCallout();

    expect(
      screen.queryByText('Branding requires an Enterprise key'),
    ).not.toBeInTheDocument();
  });
});
