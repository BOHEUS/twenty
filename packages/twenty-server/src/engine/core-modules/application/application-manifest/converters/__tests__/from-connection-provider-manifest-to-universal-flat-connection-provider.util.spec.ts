import { type ConnectionProviderManifest } from 'twenty-shared/application';

import { fromConnectionProviderManifestToUniversalFlatConnectionProvider } from 'src/engine/core-modules/application/application-manifest/converters/from-connection-provider-manifest-to-universal-flat-connection-provider.util';

const APP_UID = 'a8a8a8a8-a8a8-4a8a-a8a8-a8a8a8a8a8a8';
const PROVIDER_UID = '99fcd8e8-fbb1-4d2c-bc16-7c61ef3eaaaa';
const NOW = '2026-05-04T00:00:00.000Z';

const buildManifest = (
  overrides: Partial<ConnectionProviderManifest> = {},
): ConnectionProviderManifest =>
  ({
    universalIdentifier: PROVIDER_UID,
    name: 'linear',
    displayName: 'Linear',
    type: 'oauth',
    oauth: {
      authorizationEndpoint: 'https://linear.app/oauth/authorize',
      tokenEndpoint: 'https://api.linear.app/oauth/token',
      scopes: ['read', 'write'],
      clientIdVariable: 'LINEAR_CLIENT_ID',
      clientSecretVariable: 'LINEAR_CLIENT_SECRET',
    },
    ...overrides,
  }) as ConnectionProviderManifest;

describe('fromConnectionProviderManifestToUniversalFlatConnectionProvider', () => {
  it('moves OAuth manifest fields into the resolved oauthConfig blob with defaults filled', () => {
    const result =
      fromConnectionProviderManifestToUniversalFlatConnectionProvider({
        connectionProviderManifest: buildManifest(),
        applicationUniversalIdentifier: APP_UID,
        now: NOW,
      });

    expect(result).toEqual({
      universalIdentifier: PROVIDER_UID,
      applicationUniversalIdentifier: APP_UID,
      name: 'linear',
      displayName: 'Linear',
      type: 'oauth',
      oauthConfig: {
        authorizationEndpoint: 'https://linear.app/oauth/authorize',
        tokenEndpoint: 'https://api.linear.app/oauth/token',
        revokeEndpoint: null,
        scopes: ['read', 'write'],
        clientIdVariable: 'LINEAR_CLIENT_ID',
        clientSecretVariable: 'LINEAR_CLIENT_SECRET',
        authorizationParams: null,
        tokenRequestContentType: 'json',
        usePkce: true,
      },
      apiKeyConfig: null,
      onConnectLogicFunctionUniversalIdentifier: null,
      onDisconnectLogicFunctionUniversalIdentifier: null,
      onSendMessageLogicFunctionUniversalIdentifier: null,
      createdAt: NOW,
      updatedAt: NOW,
    });
  });

  it('resolves the onConnectLogicFunction universalIdentifier into the flat field when provided', () => {
    const onConnectLogicFunctionUniversalIdentifier =
      'c1c1c1c1-c1c1-4c1c-c1c1-c1c1c1c1c1c1';

    const result =
      fromConnectionProviderManifestToUniversalFlatConnectionProvider({
        connectionProviderManifest: buildManifest({
          onConnectLogicFunction: {
            universalIdentifier: onConnectLogicFunctionUniversalIdentifier,
          },
        }),
        applicationUniversalIdentifier: APP_UID,
        now: NOW,
      });

    expect(result.onConnectLogicFunctionUniversalIdentifier).toBe(
      onConnectLogicFunctionUniversalIdentifier,
    );
  });

  it('resolves the onDisconnectLogicFunction universalIdentifier into the flat field when provided', () => {
    const onDisconnectLogicFunctionUniversalIdentifier =
      'd2d2d2d2-d2d2-4d2d-d2d2-d2d2d2d2d2d2';

    const result =
      fromConnectionProviderManifestToUniversalFlatConnectionProvider({
        connectionProviderManifest: buildManifest({
          onDisconnectLogicFunction: {
            universalIdentifier: onDisconnectLogicFunctionUniversalIdentifier,
          },
        }),
        applicationUniversalIdentifier: APP_UID,
        now: NOW,
      });

    expect(result.onDisconnectLogicFunctionUniversalIdentifier).toBe(
      onDisconnectLogicFunctionUniversalIdentifier,
    );
  });

  it('passes through optional oauth config when provided', () => {
    const result =
      fromConnectionProviderManifestToUniversalFlatConnectionProvider({
        connectionProviderManifest: buildManifest({
          oauth: {
            authorizationEndpoint: 'https://linear.app/oauth/authorize',
            tokenEndpoint: 'https://api.linear.app/oauth/token',
            revokeEndpoint: 'https://api.linear.app/oauth/revoke',
            scopes: ['read', 'write'],
            clientIdVariable: 'LINEAR_CLIENT_ID',
            clientSecretVariable: 'LINEAR_CLIENT_SECRET',
            authorizationParams: { prompt: 'consent' },
            tokenRequestContentType: 'form-urlencoded',
            usePkce: false,
          },
        }),
        applicationUniversalIdentifier: APP_UID,
        now: NOW,
      });

    expect(result.oauthConfig).toMatchObject({
      revokeEndpoint: 'https://api.linear.app/oauth/revoke',
      authorizationParams: { prompt: 'consent' },
      tokenRequestContentType: 'form-urlencoded',
      usePkce: false,
    });
  });

  it('defaults to json content-type and PKCE-on when oauth config omits them', () => {
    const result =
      fromConnectionProviderManifestToUniversalFlatConnectionProvider({
        connectionProviderManifest: buildManifest(),
        applicationUniversalIdentifier: APP_UID,
        now: NOW,
      });

    expect(result.oauthConfig?.tokenRequestContentType).toBe('json');
    expect(result.oauthConfig?.usePkce).toBe(true);
  });

  it('resolves the onSendMessageLogicFunction universalIdentifier into the flat field when provided', () => {
    const onSendMessageLogicFunctionUniversalIdentifier =
      'd1d1d1d1-d1d1-4d1d-d1d1-d1d1d1d1d1d1';

    const result =
      fromConnectionProviderManifestToUniversalFlatConnectionProvider({
        connectionProviderManifest: buildManifest({
          onSendMessageLogicFunction: {
            universalIdentifier: onSendMessageLogicFunctionUniversalIdentifier,
          },
        }),
        applicationUniversalIdentifier: APP_UID,
        now: NOW,
      });

    expect(result.onSendMessageLogicFunctionUniversalIdentifier).toBe(
      onSendMessageLogicFunctionUniversalIdentifier,
    );
  });

  it('moves apiKey manifest fields into the resolved apiKeyConfig blob with defaults filled', () => {
    const result =
      fromConnectionProviderManifestToUniversalFlatConnectionProvider({
        connectionProviderManifest: {
          universalIdentifier: PROVIDER_UID,
          name: 'telegram',
          displayName: 'Telegram',
          type: 'apiKey',
          apiKey: {
            fields: [
              { key: 'botToken', label: 'Bot token' },
              { key: 'botName', label: 'Bot name', isSecret: false },
            ],
            tokenFieldKey: 'botToken',
            handleFieldKey: 'botName',
          },
        },
        applicationUniversalIdentifier: APP_UID,
        now: NOW,
      });

    expect(result.oauthConfig).toBeNull();
    expect(result.apiKeyConfig).toEqual({
      fields: [
        {
          key: 'botToken',
          label: 'Bot token',
          isSecret: true,
          isRequired: true,
          placeholder: null,
        },
        {
          key: 'botName',
          label: 'Bot name',
          isSecret: false,
          isRequired: true,
          placeholder: null,
        },
      ],
      tokenFieldKey: 'botToken',
      handleFieldKey: 'botName',
    });
  });
});
