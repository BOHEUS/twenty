import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, type TestingModule } from '@nestjs/testing';

import { ConnectionProviderService } from 'src/engine/core-modules/application/connection-provider/connection-provider.service';
import { LogicFunctionExecutorService } from 'src/engine/core-modules/logic-function/logic-function-executor/logic-function-executor.service';
import { LogicFunctionExecutionStatus } from 'src/engine/metadata-modules/logic-function/dtos/logic-function-execution-result.dto';
import { type ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { MessageChannelEntity } from 'src/engine/metadata-modules/message-channel/entities/message-channel.entity';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { AppMessageOutboundService } from 'src/modules/messaging/message-outbound-manager/drivers/app/services/app-message-outbound.service';
import { type SendMessageInput } from 'src/modules/messaging/message-outbound-manager/types/send-message-input.type';

const WORKSPACE_ID = '20202020-0000-0000-0000-000000000001';
const CONNECTED_ACCOUNT_ID = '20202020-0000-0000-0000-000000000002';
const MESSAGE_CHANNEL_ID = '20202020-0000-0000-0000-000000000003';
const CONNECTION_PROVIDER_ID = '20202020-0000-0000-0000-000000000004';
const LOGIC_FUNCTION_UID = '20202020-0000-0000-0000-000000000005';

describe('AppMessageOutboundService', () => {
  let service: AppMessageOutboundService;
  let messageChannelRepository: { findOne: jest.Mock; find: jest.Mock };
  let logicFunctionExecutorService: { execute: jest.Mock };
  let provider: Record<string, unknown>;

  const connectedAccount = {
    id: CONNECTED_ACCOUNT_ID,
    workspaceId: WORKSPACE_ID,
    connectionProviderId: CONNECTION_PROVIDER_ID,
  } as ConnectedAccountEntity;

  const sendMessageInput: SendMessageInput = {
    subject: '',
    body: 'hello',
    html: '',
    to: ['33780123456'],
    threadExternalId: 'chat-1',
    messageChannelId: MESSAGE_CHANNEL_ID,
  };

  beforeEach(async () => {
    provider = {
      id: CONNECTION_PROVIDER_ID,
      name: 'whatsapp',
      onSendMessageLogicFunctionUniversalIdentifier: LOGIC_FUNCTION_UID,
    };

    messageChannelRepository = {
      findOne: jest.fn().mockResolvedValue({
        id: MESSAGE_CHANNEL_ID,
        handle: '33711111111',
      }),
      find: jest.fn().mockResolvedValue([]),
    };

    logicFunctionExecutorService = {
      execute: jest.fn().mockResolvedValue({
        status: LogicFunctionExecutionStatus.SUCCESS,
        data: { externalId: 'wamid.abc', threadExternalId: 'chat-1' },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppMessageOutboundService,
        {
          provide: ConnectionProviderService,
          useValue: { findOneByIdOrThrow: jest.fn(async () => provider) },
        },
        {
          provide: LogicFunctionExecutorService,
          useValue: logicFunctionExecutorService,
        },
        {
          provide: WorkspaceCacheService,
          useValue: {
            getOrRecompute: jest.fn().mockResolvedValue({
              flatLogicFunctionMaps: {
                byUniversalIdentifier: {
                  [LOGIC_FUNCTION_UID]: {
                    id: 'logic-function-1',
                    deletedAt: null,
                  },
                },
              },
            }),
          },
        },
        {
          provide: getRepositoryToken(MessageChannelEntity),
          useValue: messageChannelRepository,
        },
      ],
    }).compile();

    service = module.get(AppMessageOutboundService);
  });

  it("hands the app the channel it is sending from and namespaces the result's header id", async () => {
    const result = await service.sendMessage(
      sendMessageInput,
      connectedAccount,
    );

    expect(logicFunctionExecutorService.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        logicFunctionId: 'logic-function-1',
        workspaceId: WORKSPACE_ID,
        payload: expect.objectContaining({
          messageChannelId: MESSAGE_CHANNEL_ID,
          channelHandle: '33711111111',
          connectionProviderName: 'whatsapp',
          to: ['33780123456'],
          threadExternalId: 'chat-1',
        }),
      }),
    );

    expect(result).toEqual({
      headerMessageId: `${MESSAGE_CHANNEL_ID}:wamid.abc`,
      messageExternalId: 'wamid.abc',
      threadExternalId: 'chat-1',
    });
  });

  it('falls back to the account single channel when the caller named none', async () => {
    messageChannelRepository.find.mockResolvedValue([
      { id: MESSAGE_CHANNEL_ID, handle: '33711111111' },
    ]);

    await service.sendMessage(
      { ...sendMessageInput, messageChannelId: undefined },
      connectedAccount,
    );

    expect(messageChannelRepository.findOne).not.toHaveBeenCalled();
    expect(logicFunctionExecutorService.execute).toHaveBeenCalled();
  });

  it('refuses to guess when the account fronts several channels', async () => {
    messageChannelRepository.find.mockResolvedValue([
      { id: 'channel-a', handle: '33711111111' },
      { id: 'channel-b', handle: '33722222222' },
    ]);

    await expect(
      service.sendMessage(
        { ...sendMessageInput, messageChannelId: undefined },
        connectedAccount,
      ),
    ).rejects.toThrow('must name the one it is sent from');
  });

  it('rejects a channel that belongs to another account', async () => {
    messageChannelRepository.findOne.mockResolvedValue(null);

    await expect(
      service.sendMessage(sendMessageInput, connectedAccount),
    ).rejects.toThrow('does not belong to connected account');
  });

  it('surfaces a failed execution rather than reporting a send', async () => {
    logicFunctionExecutorService.execute.mockResolvedValue({
      status: LogicFunctionExecutionStatus.ERROR,
      data: null,
      error: { errorMessage: 'rate limited' },
    });

    await expect(
      service.sendMessage(sendMessageInput, connectedAccount),
    ).rejects.toThrow('rate limited');
  });

  it('rejects a response that carries no externalId', async () => {
    logicFunctionExecutorService.execute.mockResolvedValue({
      status: LogicFunctionExecutionStatus.SUCCESS,
      data: { threadExternalId: 'chat-1' },
    });

    await expect(
      service.sendMessage(sendMessageInput, connectedAccount),
    ).rejects.toThrow('did not return an externalId');
  });

  it('refuses a provider that declares no onSendMessage logic function', async () => {
    provider = {
      ...provider,
      onSendMessageLogicFunctionUniversalIdentifier: null,
    };

    await expect(
      service.sendMessage(sendMessageInput, connectedAccount),
    ).rejects.toThrow('does not declare an onSendMessageLogicFunction');
  });
});
