import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, type TestingModule } from '@nestjs/testing';

import { ConnectedAccountProvider } from 'twenty-shared/types';

import { ConnectionProviderApiKeyFlowService } from 'src/engine/core-modules/application/connection-provider/connection-provider-api-key-flow.service';
import { ConnectionProviderLifecycleHookService } from 'src/engine/core-modules/application/connection-provider/connection-provider-lifecycle-hook.service';
import { ConnectionProviderService } from 'src/engine/core-modules/application/connection-provider/connection-provider.service';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { ConnectedAccountTokenEncryptionService } from 'src/engine/metadata-modules/connected-account/services/connected-account-token-encryption.service';

const WORKSPACE_ID = '20202020-0000-0000-0000-000000000001';
const APPLICATION_ID = '20202020-0000-0000-0000-000000000002';
const PROVIDER_ID = '20202020-0000-0000-0000-000000000003';
const USER_ID = '20202020-0000-0000-0000-000000000004';
const USER_WORKSPACE_ID = '20202020-0000-0000-0000-000000000005';

describe('ConnectionProviderApiKeyFlowService', () => {
  let service: ConnectionProviderApiKeyFlowService;
  let connectedAccountRepository: {
    count: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };
  let provider: Record<string, unknown>;

  const connect = (fieldValues: { key: string; value: string }[]) =>
    service.connect({
      connectionProviderId: PROVIDER_ID,
      fieldValues,
      visibility: 'workspace',
      workspaceId: WORKSPACE_ID,
      userId: USER_ID,
      userWorkspaceId: USER_WORKSPACE_ID,
    });

  beforeEach(async () => {
    provider = {
      id: PROVIDER_ID,
      applicationId: APPLICATION_ID,
      name: 'telegram',
      displayName: 'Telegram',
      type: 'apiKey',
      apiKeyConfig: {
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
            isRequired: false,
            placeholder: null,
          },
        ],
        tokenFieldKey: 'botToken',
        handleFieldKey: 'botName',
      },
    };

    connectedAccountRepository = {
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn((entity) => entity),
      save: jest.fn((entity) => ({ ...entity, id: 'connected-account-1' })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionProviderApiKeyFlowService,
        {
          provide: ConnectionProviderService,
          useValue: {
            findOneByIdOrThrow: jest.fn(async () => provider),
          },
        },
        {
          provide: ConnectedAccountTokenEncryptionService,
          useValue: {
            encrypt: jest.fn(({ plaintext }) => `enc:v2:${plaintext}`),
          },
        },
        {
          provide: ConnectionProviderLifecycleHookService,
          useValue: { dispatchOnConnect: jest.fn() },
        },
        {
          provide: getRepositoryToken(ConnectedAccountEntity),
          useValue: connectedAccountRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue({ email: 'me@company.com' }),
          },
        },
      ],
    }).compile();

    service = module.get(ConnectionProviderApiKeyFlowService);
  });

  it('encrypts the token field and keeps the rest as plain parameters', async () => {
    await connect([
      { key: 'botToken', value: 'secret-token' },
      { key: 'botName', value: '@support_bot' },
    ]);

    expect(connectedAccountRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: 'enc:v2:secret-token',
        apiKeyParameters: { botName: '@support_bot' },
        handle: '@support_bot',
        provider: ConnectedAccountProvider.APP,
        applicationId: APPLICATION_ID,
        connectionProviderId: PROVIDER_ID,
        visibility: 'workspace',
      }),
    );
  });

  it('names the account after the connecting user when no handle field was filled', async () => {
    await connect([{ key: 'botToken', value: 'secret-token' }]);

    expect(connectedAccountRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        handle: 'me@company.com',
        apiKeyParameters: null,
      }),
    );
  });

  it('rejects a value for a field the provider never declared', async () => {
    await expect(
      connect([
        { key: 'botToken', value: 'secret-token' },
        { key: 'sneaky', value: 'value' },
      ]),
    ).rejects.toThrow('does not declare a field named "sneaky"');
  });

  it('rejects a missing required field', async () => {
    await expect(
      connect([{ key: 'botName', value: '@support_bot' }]),
    ).rejects.toThrow('requires a value for "botToken"');
  });

  it('refuses a provider that is not api-key typed', async () => {
    provider = { ...provider, type: 'oauth', apiKeyConfig: null };

    await expect(
      connect([{ key: 'botToken', value: 'secret-token' }]),
    ).rejects.toThrow('is not apiKey-typed');
  });
});
