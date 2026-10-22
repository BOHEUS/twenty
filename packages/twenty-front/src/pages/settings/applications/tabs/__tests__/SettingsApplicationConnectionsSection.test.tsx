import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { GET_MY_CONNECTED_ACCOUNTS } from '@/settings/accounts/graphql/queries/getMyConnectedAccounts';
import {
  ApplicationConnectedAccountsDocument,
  ConnectAppWithApiKeyDocument,
  ConnectedAccountScope,
  ConnectionProviderScope,
} from '~/generated-metadata/graphql';
import { SettingsApplicationConnectionsSection } from '~/pages/settings/applications/tabs/SettingsApplicationConnectionsSection';
import { useFindApplicationConnectionProviders } from '~/pages/settings/applications/hooks/useFindApplicationConnectionProviders';
import { useApplicationConnectedAccounts } from '~/pages/settings/applications/hooks/useApplicationConnectedAccounts';
import { getJestMetadataAndApolloMocksWrapper } from '~/testing/jest/getJestMetadataAndApolloMocksWrapper';

const mockTriggerAppOAuth = jest.fn();

jest.mock(
  '~/pages/settings/applications/hooks/useFindApplicationConnectionProviders',
  () => ({
    useFindApplicationConnectionProviders: jest.fn(),
  }),
);

jest.mock(
  '~/pages/settings/applications/hooks/useApplicationConnectedAccounts',
  () => ({
    useApplicationConnectedAccounts: jest.fn(),
  }),
);

jest.mock('~/pages/settings/applications/hooks/useTriggerAppOAuth', () => ({
  useTriggerAppOAuth: jest.fn(() => ({
    triggerAppOAuth: mockTriggerAppOAuth,
  })),
}));

const mockedUseFindApplicationConnectionProviders =
  useFindApplicationConnectionProviders as jest.MockedFunction<
    typeof useFindApplicationConnectionProviders
  >;

const mockedUseApplicationConnectedAccounts =
  useApplicationConnectedAccounts as jest.MockedFunction<
    typeof useApplicationConnectedAccounts
  >;

describe('SettingsApplicationConnectionsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders app connection rows as links to the connection detail page', () => {
    mockedUseFindApplicationConnectionProviders.mockReturnValue({
      connectionProviders: [
        {
          id: 'provider-1',
          applicationId: 'app-1',
          type: 'oauth',
          name: 'google-calendar',
          displayName: 'Google Calendar',
          scope: 'WORKSPACE',
          logoUrl: null,
          oauth: {
            scopes: ['calendar.readonly'],
            isClientCredentialsConfigured: false,
          },
        },
      ],
      loading: false,
      refetch: jest.fn(),
    });

    mockedUseApplicationConnectedAccounts.mockReturnValue({
      accounts: [
        {
          __typename: 'ApplicationConnectedAccountDTO',
          id: 'account-1',
          handle: 'workspace@example.com',
          authFailedAt: '2026-05-01T00:00:00.000Z',
          scopes: ['calendar.readonly'],
          lastSignedInAt: null,
          connectionProviderId: 'provider-1',
          name: 'Main connection',
          scope: ConnectedAccountScope.WORKSPACE,
          lastCredentialsRefreshedAt: null,
          createdAt: '2026-05-01T00:00:00.000Z',
          updatedAt: '2026-05-01T00:00:00.000Z',
        },
      ],
      loading: false,
      refetch: jest.fn(),
    });

    render(
      <I18nProvider i18n={i18n}>
        <MemoryRouter>
          <SettingsApplicationConnectionsSection applicationId="app-1" />
        </MemoryRouter>
      </I18nProvider>,
    );

    expect(
      screen.getByRole('link', { name: /Main connection/i }),
    ).toHaveAttribute(
      'href',
      '/settings/applications/app-1/connections/account-1',
    );
    expect(screen.getByText('Reconnect needed')).toBeVisible();
    expect(screen.getByText('Workspace shared')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Reconnect' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Delete' }),
    ).not.toBeInTheDocument();
  });

  it('adds a workspace shared connection without asking for a scope', async () => {
    mockedUseFindApplicationConnectionProviders.mockReturnValue({
      connectionProviders: [
        {
          id: 'provider-1',
          applicationId: 'app-1',
          type: 'oauth',
          name: 'google-calendar',
          displayName: 'Google Calendar',
          scope: 'WORKSPACE',
          logoUrl: null,
          oauth: {
            scopes: ['calendar.readonly'],
            isClientCredentialsConfigured: true,
          },
        },
      ],
      loading: false,
      refetch: jest.fn(),
    });

    mockedUseApplicationConnectedAccounts.mockReturnValue({
      accounts: [],
      loading: false,
      refetch: jest.fn(),
    });

    render(
      <I18nProvider i18n={i18n}>
        <MemoryRouter>
          <SettingsApplicationConnectionsSection applicationId="app-1" />
        </MemoryRouter>
      </I18nProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: /Add connection/i }),
    );

    expect(screen.queryByText('Just for me')).not.toBeInTheDocument();
    expect(mockTriggerAppOAuth).toHaveBeenCalledTimes(1);
    expect(mockTriggerAppOAuth).toHaveBeenCalledWith({
      applicationId: 'app-1',
      providerName: 'google-calendar',
      scope: 'WORKSPACE',
    });
  });

  it('hides a provider scoped to each member when the caller sees none of its connections', () => {
    mockedUseFindApplicationConnectionProviders.mockReturnValue({
      connectionProviders: [
        {
          id: 'provider-1',
          applicationId: 'app-1',
          type: 'oauth',
          name: 'google-calendar',
          displayName: 'Google Calendar',
          scope: 'USER',
          logoUrl: null,
          oauth: {
            scopes: ['calendar.readonly'],
            isClientCredentialsConfigured: false,
          },
        },
      ],
      loading: false,
      refetch: jest.fn(),
    });

    mockedUseApplicationConnectedAccounts.mockReturnValue({
      accounts: [],
      loading: false,
      refetch: jest.fn(),
    });

    render(
      <I18nProvider i18n={i18n}>
        <MemoryRouter>
          <SettingsApplicationConnectionsSection applicationId="app-1" />
        </MemoryRouter>
      </I18nProvider>,
    );

    expect(screen.queryByText('Google Calendar')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Add connection/i }),
    ).not.toBeInTheDocument();
  });

  it('lists the connections of a provider scoped to each member without offering to add one', () => {
    mockedUseFindApplicationConnectionProviders.mockReturnValue({
      connectionProviders: [
        {
          id: 'provider-1',
          applicationId: 'app-1',
          type: 'oauth',
          name: 'google-calendar',
          displayName: 'Google Calendar',
          scope: 'USER',
          logoUrl: null,
          oauth: {
            scopes: ['calendar.readonly'],
            isClientCredentialsConfigured: false,
          },
        },
      ],
      loading: false,
      refetch: jest.fn(),
    });

    mockedUseApplicationConnectedAccounts.mockReturnValue({
      accounts: [
        {
          __typename: 'ApplicationConnectedAccountDTO',
          id: 'account-1',
          handle: 'me@example.com',
          authFailedAt: null,
          scopes: ['calendar.readonly'],
          lastSignedInAt: null,
          connectionProviderId: 'provider-1',
          name: 'My calendar',
          scope: ConnectedAccountScope.USER,
          lastCredentialsRefreshedAt: null,
          createdAt: '2026-05-01T00:00:00.000Z',
          updatedAt: '2026-05-01T00:00:00.000Z',
        },
      ],
      loading: false,
      refetch: jest.fn(),
    });

    render(
      <I18nProvider i18n={i18n}>
        <MemoryRouter>
          <SettingsApplicationConnectionsSection applicationId="app-1" />
        </MemoryRouter>
      </I18nProvider>,
    );

    expect(screen.getByRole('link', { name: /My calendar/i })).toBeVisible();
    expect(screen.getByText('Just for me')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: /Add connection/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/OAuth is not yet set up/),
    ).not.toBeInTheDocument();
  });

  it('connects an API key provider through the key dialog instead of OAuth', async () => {
    mockedUseFindApplicationConnectionProviders.mockReturnValue({
      connectionProviders: [
        {
          id: 'provider-1',
          applicationId: 'app-1',
          type: 'apiKey',
          name: 'acme',
          displayName: 'Acme',
          scope: 'WORKSPACE',
          logoUrl: null,
          oauth: null,
        },
      ],
      loading: false,
      refetch: jest.fn(),
    });

    mockedUseApplicationConnectedAccounts.mockReturnValue({
      accounts: [],
      loading: false,
      refetch: jest.fn(),
    });

    const connectAppWithApiKeyMock = jest.fn(() => ({
      data: { connectAppWithApiKey: true },
    }));

    const Wrapper = getJestMetadataAndApolloMocksWrapper({
      apolloMocks: [
        {
          request: {
            query: ConnectAppWithApiKeyDocument,
            variables: {
              input: {
                applicationId: 'app-1',
                providerName: 'acme',
                apiKey: 'acme-secret',
                scope: ConnectionProviderScope.WORKSPACE,
              },
            },
          },
          result: connectAppWithApiKeyMock,
        },
        {
          request: {
            query: ApplicationConnectedAccountsDocument,
            variables: { applicationId: 'app-1' },
          },
          result: { data: { applicationConnectedAccounts: [] } },
        },
        {
          request: { query: GET_MY_CONNECTED_ACCOUNTS },
          result: { data: { myConnectedAccounts: [] } },
        },
      ],
    });

    render(<SettingsApplicationConnectionsSection applicationId="app-1" />, {
      wrapper: ({ children }: { children: ReactNode }) => (
        <Wrapper>
          <I18nProvider i18n={i18n}>
            <MemoryRouter>{children}</MemoryRouter>
          </I18nProvider>
        </Wrapper>
      ),
    });

    expect(
      screen.queryByText(/OAuth is not yet set up/),
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: /Add connection/i }),
    );

    expect(screen.getByText('Connect Acme')).toBeVisible();

    await userEvent.type(screen.getByLabelText('API key'), 'acme-secret');
    await userEvent.click(screen.getByRole('button', { name: 'Connect' }));

    await waitFor(() =>
      expect(screen.queryByText('Connect Acme')).not.toBeInTheDocument(),
    );
    expect(connectAppWithApiKeyMock).toHaveBeenCalledTimes(1);
    expect(mockTriggerAppOAuth).not.toHaveBeenCalled();
  });
});
