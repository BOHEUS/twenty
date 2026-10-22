import { createHash } from 'crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import gql from 'graphql-tag';
import { buildBaseManifest } from 'test/integration/metadata/suites/application/utils/build-base-manifest.util';
import { cleanupApplicationAndAppRegistration } from 'test/integration/metadata/suites/application/utils/cleanup-application-and-app-registration.util';
import { setupApplicationForSync } from 'test/integration/metadata/suites/application/utils/setup-application-for-sync.util';
import { syncApplication } from 'test/integration/metadata/suites/application/utils/sync-application.util';
import { uploadApplicationFile } from 'test/integration/metadata/suites/application/utils/upload-application-file.util';
import { makeMetadataApiRequest } from 'test/integration/metadata/suites/utils/make-metadata-api-request.util';
import { waitForAllJobsToFinish } from 'test/integration/utils/wait-for-all-jobs-to-finish.util';
import { assertIsDefinedOrThrow } from 'twenty-shared/utils';
import { v4 } from 'uuid';

import { type ConnectionProviderEntity } from 'src/engine/core-modules/application/connection-provider/connection-provider.entity';
import { type ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { type ConnectedAccountTokenEncryptionService } from 'src/engine/metadata-modules/connected-account/services/connected-account-token-encryption.service';
import { SEED_APPLE_WORKSPACE_ID } from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { getAppProviderByClassName } from 'test/integration/utils/get-app-provider-by-class-name.util';

const APPLICATION_IDENTIFIER = v4();
const API_KEY_PROVIDER_IDENTIFIER = v4();
const OAUTH_PROVIDER_IDENTIFIER = v4();
const IDENTIFY_ACCOUNT_IDENTIFIER = v4();
const ON_CONNECT_IDENTIFIER = v4();

// The identify function reads the account from the key's "<account>:<suffix>" shape.
const IDENTIFY_ACCOUNT_SOURCE = `export const handler = ({ accessToken }) => {
  const [account] = accessToken.split(':');
  if (account === 'invalid') throw new Error('upstream rejected the key');
  return { externalAccountId: account, handle: 'Handle ' + account };
};`;

const CONNECT_APP_WITH_API_KEY = gql`
  mutation ConnectAppWithApiKey($input: ConnectAppWithApiKeyInput!) {
    connectAppWithApiKey(input: $input)
  }
`;

describe('connectAppWithApiKey', () => {
  let apiKeyProvider: ConnectionProviderEntity;
  let fixtureDirectory: string;
  let onConnectExecutionsPath: string;

  const connect = async ({
    apiKey,
    providerName = 'api-key-provider',
    scope = 'WORKSPACE',
    reconnectingConnectedAccountId,
    token = APPLE_JANE_ADMIN_ACCESS_TOKEN,
  }: {
    apiKey: string;
    providerName?: string;
    scope?: 'USER' | 'WORKSPACE';
    reconnectingConnectedAccountId?: string;
    token?: string;
  }) => {
    const response = await makeMetadataApiRequest(
      {
        query: CONNECT_APP_WITH_API_KEY,
        variables: {
          input: {
            applicationId: apiKeyProvider.applicationId,
            providerName,
            apiKey,
            scope,
            reconnectingConnectedAccountId,
          },
        },
      },
      token,
    );

    await waitForAllJobsToFinish();

    return response.body as {
      data?: { connectAppWithApiKey: boolean } | null;
      errors?: {
        message: string;
        extensions?: { subCode?: string; userFriendlyMessage?: string };
      }[];
    };
  };

  const readAccounts = (): Promise<ConnectedAccountEntity[]> =>
    globalThis.testDataSource.query(
      'SELECT * FROM core."connectedAccount" WHERE "connectionProviderId" = $1 ORDER BY "createdAt", id',
      [apiKeyProvider.id],
    );

  const decryptAccessToken = (connectedAccount: ConnectedAccountEntity) => {
    assertIsDefinedOrThrow(connectedAccount.accessToken);

    return getAppProviderByClassName<ConnectedAccountTokenEncryptionService>(
      'ConnectedAccountTokenEncryptionService',
    ).decrypt({
      ciphertext: connectedAccount.accessToken,
      workspaceId: SEED_APPLE_WORKSPACE_ID,
    });
  };

  const readOnConnectExecutions = (): string[] =>
    existsSync(onConnectExecutionsPath)
      ? readFileSync(onConnectExecutionsPath, 'utf8').trim().split('\n')
      : [];

  beforeAll(async () => {
    fixtureDirectory = mkdtempSync(join(tmpdir(), 'app-connection-api-key-'));
    onConnectExecutionsPath = join(fixtureDirectory, 'on-connect-executions');

    await setupApplicationForSync({
      applicationUniversalIdentifier: APPLICATION_IDENTIFIER,
      name: 'API key connection integration',
      description: 'Connecting an app with a pasted API key',
      sourcePath: 'api-key-connection-integration',
    });
    jest.useRealTimers();

    const functions = [
      {
        universalIdentifier: IDENTIFY_ACCOUNT_IDENTIFIER,
        name: 'identify-account',
        source: IDENTIFY_ACCOUNT_SOURCE,
      },
      {
        universalIdentifier: ON_CONNECT_IDENTIFIER,
        name: 'on-connect',
        source: `import { appendFileSync } from 'node:fs';
export const handler = ({ connectedAccountId }) => {
  appendFileSync(${JSON.stringify(onConnectExecutionsPath)}, connectedAccountId + '\\n');
};`,
      },
    ];

    for (const logicFunction of functions) {
      const uploaded = await uploadApplicationFile({
        applicationUniversalIdentifier: APPLICATION_IDENTIFIER,
        fileFolder: 'BuiltLogicFunction',
        filePath: `dist/${logicFunction.name}.mjs`,
        filename: `${logicFunction.name}.mjs`,
        contentType: 'application/javascript',
        fileBuffer: Buffer.from(logicFunction.source),
      });

      expect(uploaded.errors).toBeUndefined();
    }

    const { errors } = await syncApplication({
      manifest: buildBaseManifest({
        appId: APPLICATION_IDENTIFIER,
        roleId: v4(),
        overrides: {
          logicFunctions: functions.map((logicFunction) => ({
            universalIdentifier: logicFunction.universalIdentifier,
            name: logicFunction.name,
            handlerName: 'handler',
            sourceHandlerPath: `src/${logicFunction.name}.ts`,
            builtHandlerPath: `dist/${logicFunction.name}.mjs`,
            builtHandlerChecksum: createHash('sha256')
              .update(logicFunction.source)
              .digest('hex'),
            timeoutSeconds: 10,
          })),
          connectionProviders: [
            {
              universalIdentifier: API_KEY_PROVIDER_IDENTIFIER,
              name: 'api-key-provider',
              displayName: 'API key provider',
              type: 'apiKey',
              identifyAccountLogicFunction: {
                universalIdentifier: IDENTIFY_ACCOUNT_IDENTIFIER,
              },
              onConnectLogicFunction: {
                universalIdentifier: ON_CONNECT_IDENTIFIER,
              },
            },
            {
              universalIdentifier: OAUTH_PROVIDER_IDENTIFIER,
              name: 'oauth-provider',
              displayName: 'OAuth provider',
              type: 'oauth',
              oauth: {
                authorizationEndpoint:
                  'https://connection-provider.example.com/authorize',
                tokenEndpoint: 'https://connection-provider.example.com/token',
                scopes: ['read'],
                clientIdVariable: 'CLIENT_ID',
                clientSecretVariable: 'CLIENT_SECRET',
              },
            },
          ],
        },
      }),
    });

    expect(errors).toBeUndefined();
    jest.useRealTimers();
    [apiKeyProvider] = await globalThis.testDataSource.query(
      'SELECT * FROM core."connectionProvider" WHERE "universalIdentifier" = $1',
      [API_KEY_PROVIDER_IDENTIFIER],
    );
  }, 120000);

  beforeEach(() => {
    rmSync(onConnectExecutionsPath, { force: true });
  });

  afterEach(async () => {
    await globalThis.testDataSource.query(
      'DELETE FROM core."connectedAccount" WHERE "applicationId" = $1',
      [apiKeyProvider.applicationId],
    );
  });

  afterAll(async () => {
    await cleanupApplicationAndAppRegistration({
      applicationUniversalIdentifier: APPLICATION_IDENTIFIER,
    });
    rmSync(fixtureDirectory, { recursive: true, force: true });
  });

  it('stores the key as the identified account and runs onConnect for it', async () => {
    const { data, errors } = await connect({ apiKey: '  alice:secret  ' });

    expect(errors).toBeUndefined();
    expect(data?.connectAppWithApiKey).toBe(true);

    const [account] = await readAccounts();

    assertIsDefinedOrThrow(account);
    expect(account).toMatchObject({
      externalAccountId: 'alice',
      handle: 'Handle alice',
      scope: 'WORKSPACE',
      refreshToken: null,
    });
    expect(decryptAccessToken(account)).toBe('alice:secret');
    expect(readOnConnectExecutions()).toEqual([account.id]);
  });

  it('saves nothing when the identify function rejects the key', async () => {
    const { errors } = await connect({ apiKey: 'invalid:secret' });

    expect(errors?.[0]?.message).toContain('upstream rejected the key');
    expect(errors?.[0]?.extensions).toMatchObject({
      subCode: 'API_KEY_REJECTED',
      userFriendlyMessage: 'API key provider rejected this API key.',
    });
    expect(await readAccounts()).toEqual([]);
    expect(readOnConnectExecutions()).toEqual([]);
  });

  it('replaces the key on reconnect to the same account', async () => {
    await connect({ apiKey: 'alice:first' });
    const [original] = await readAccounts();

    assertIsDefinedOrThrow(original);

    const { errors } = await connect({
      apiKey: 'alice:second',
      reconnectingConnectedAccountId: original.id,
    });

    expect(errors).toBeUndefined();

    const [reconnected, ...otherAccounts] = await readAccounts();

    assertIsDefinedOrThrow(reconnected);
    expect(otherAccounts).toEqual([]);
    expect(decryptAccessToken(reconnected)).toBe('alice:second');
  });

  it('refuses a reconnect with a key for a different account', async () => {
    await connect({ apiKey: 'alice:first' });
    const [original] = await readAccounts();

    assertIsDefinedOrThrow(original);

    const { errors } = await connect({
      apiKey: 'bob:second',
      reconnectingConnectedAccountId: original.id,
    });

    expect(errors?.[0]?.message).toContain(
      'You authorized Handle bob, but this connection belongs to Handle alice',
    );

    const [unchanged] = await readAccounts();

    assertIsDefinedOrThrow(unchanged);
    expect(decryptAccessToken(unchanged)).toBe('alice:first');
  });

  it('refuses a member without the Applications permission to add a workspace connection', async () => {
    const { errors } = await connect({
      apiKey: 'alice:secret',
      token: APPLE_JONY_MEMBER_ACCESS_TOKEN,
    });

    expect(errors?.[0]?.message).toContain('does not have permission');
    expect(await readAccounts()).toEqual([]);
  });

  it('refuses a blank key', async () => {
    const { errors } = await connect({ apiKey: '   ' });

    expect(errors?.[0]?.message).toContain('API key must not be empty');
    expect(await readAccounts()).toEqual([]);
  });

  it('refuses an OAuth provider', async () => {
    const { errors } = await connect({
      apiKey: 'alice:secret',
      providerName: 'oauth-provider',
    });

    expect(errors?.[0]?.message).toContain('does not accept API keys');
  });
});
