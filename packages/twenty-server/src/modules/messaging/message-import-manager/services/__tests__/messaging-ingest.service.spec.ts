import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, type TestingModule } from '@nestjs/testing';

import {
  MessageChannelType,
  MessageHandleKind,
  MessageParticipantRole,
} from 'twenty-shared/types';

import { ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { MessageChannelEntity } from 'src/engine/metadata-modules/message-channel/entities/message-channel.entity';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { MessageDirection } from 'src/modules/messaging/common/enums/message-direction.enum';
import { type IngestMessagesInput } from 'src/modules/messaging/message-import-manager/dtos/ingest-messages.input';
import { MessagingIngestService } from 'src/modules/messaging/message-import-manager/services/messaging-ingest.service';
import { MessagingSaveMessagesAndEnqueueContactCreationService } from 'src/modules/messaging/message-import-manager/services/messaging-save-messages-and-enqueue-contact-creation.service';

const WORKSPACE_ID = '20202020-0000-0000-0000-000000000001';
const APPLICATION_ID = '20202020-0000-0000-0000-000000000002';
const MESSAGE_CHANNEL_ID = '20202020-0000-0000-0000-000000000003';
const CONNECTED_ACCOUNT_ID = '20202020-0000-0000-0000-000000000004';

describe('MessagingIngestService', () => {
  let service: MessagingIngestService;
  let messageChannelRepository: { findOne: jest.Mock };
  let connectedAccountRepository: { findOne: jest.Mock };
  let saveMessagesService: jest.Mocked<MessagingSaveMessagesAndEnqueueContactCreationService>;

  const buildInput = (
    overrides: Partial<IngestMessagesInput> = {},
  ): IngestMessagesInput => ({
    messageChannelId: MESSAGE_CHANNEL_ID,
    messages: [
      {
        externalId: 'provider-1',
        threadExternalId: 'thread-1',
        direction: MessageDirection.INCOMING,
        text: 'hello',
        receivedAt: new Date('2026-01-01T00:00:00.000Z'),
        participants: [
          {
            role: MessageParticipantRole.FROM,
            handle: 'contact@example.com',
            displayName: 'Contact',
          },
          {
            role: MessageParticipantRole.TO,
            handle: 'support@company.com',
          },
        ],
      },
    ],
    ...overrides,
  });

  beforeEach(async () => {
    messageChannelRepository = {
      findOne: jest.fn().mockResolvedValue({
        id: MESSAGE_CHANNEL_ID,
        workspaceId: WORKSPACE_ID,
        type: MessageChannelType.CHAT,
        connectedAccountId: CONNECTED_ACCOUNT_ID,
      }),
    };
    connectedAccountRepository = {
      findOne: jest.fn().mockResolvedValue({
        id: CONNECTED_ACCOUNT_ID,
        workspaceId: WORKSPACE_ID,
        applicationId: APPLICATION_ID,
      }),
    };
    saveMessagesService = {
      saveMessagesAndEnqueueContactCreation: jest.fn().mockResolvedValue({
        messageExternalIdsAndIdsMap: new Map([['provider-1', 'message-1']]),
        messageExternalIdToMessageThreadIdMap: new Map([
          ['provider-1', 'thread-id-1'],
        ]),
        createdMessageIds: new Set(['message-1']),
      }),
    } as unknown as jest.Mocked<MessagingSaveMessagesAndEnqueueContactCreationService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagingIngestService,
        {
          provide: getRepositoryToken(MessageChannelEntity),
          useValue: messageChannelRepository,
        },
        {
          provide: getRepositoryToken(ConnectedAccountEntity),
          useValue: connectedAccountRepository,
        },
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: {
            executeInWorkspaceContext: jest.fn((callback) => callback()),
          },
        },
        {
          provide: MessagingSaveMessagesAndEnqueueContactCreationService,
          useValue: saveMessagesService,
        },
      ],
    }).compile();

    service = module.get(MessagingIngestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('forwards the batch to the save funnel and reports what was created', async () => {
    const result = await service.ingestMessages({
      applicationId: APPLICATION_ID,
      input: buildInput(),
      workspaceId: WORKSPACE_ID,
    });

    expect(result.results).toEqual([
      {
        externalId: 'provider-1',
        messageId: 'message-1',
        messageThreadId: 'thread-id-1',
        created: true,
      },
    ]);

    const [messages] =
      saveMessagesService.saveMessagesAndEnqueueContactCreation.mock.calls[0];

    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({
      externalId: 'provider-1',
      messageThreadExternalId: 'thread-1',
      direction: MessageDirection.INCOMING,
      text: 'hello',
      subject: '',
      isDraft: false,
      attachments: [],
    });
    expect(messages[0].participants).toEqual([
      {
        role: MessageParticipantRole.FROM,
        handle: 'contact@example.com',
        handleKind: MessageHandleKind.EMAIL,
        displayName: 'Contact',
        matchHints: undefined,
      },
      {
        role: MessageParticipantRole.TO,
        handle: 'support@company.com',
        handleKind: MessageHandleKind.EMAIL,
        displayName: '',
        matchHints: undefined,
      },
    ]);
  });

  it('namespaces headerMessageId by channel so per-chat provider ids stay unique', async () => {
    await service.ingestMessages({
      applicationId: APPLICATION_ID,
      input: buildInput(),
      workspaceId: WORKSPACE_ID,
    });

    const [messages] =
      saveMessagesService.saveMessagesAndEnqueueContactCreation.mock.calls[0];

    expect(messages[0].headerMessageId).toBe(
      `${MESSAGE_CHANNEL_ID}:provider-1`,
    );
  });

  it('reports created: false when the funnel returned an existing message', async () => {
    saveMessagesService.saveMessagesAndEnqueueContactCreation.mockResolvedValue(
      {
        messageExternalIdsAndIdsMap: new Map([['provider-1', 'message-1']]),
        messageExternalIdToMessageThreadIdMap: new Map([
          ['provider-1', 'thread-id-1'],
        ]),
        createdMessageIds: new Set<string>(),
      },
    );

    const result = await service.ingestMessages({
      applicationId: APPLICATION_ID,
      input: buildInput(),
      workspaceId: WORKSPACE_ID,
    });

    expect(result.results[0].created).toBe(false);
  });

  it('rejects a channel owned by another application', async () => {
    connectedAccountRepository.findOne.mockResolvedValue({
      id: CONNECTED_ACCOUNT_ID,
      workspaceId: WORKSPACE_ID,
      applicationId: 'another-application',
    });

    await expect(
      service.ingestMessages({
        applicationId: APPLICATION_ID,
        input: buildInput(),
        workspaceId: WORKSPACE_ID,
      }),
    ).rejects.toThrow('is not owned by application');
  });

  it('rejects a channel that is not a chat channel', async () => {
    messageChannelRepository.findOne.mockResolvedValue({
      id: MESSAGE_CHANNEL_ID,
      workspaceId: WORKSPACE_ID,
      type: MessageChannelType.EMAIL,
      connectedAccountId: CONNECTED_ACCOUNT_ID,
    });

    await expect(
      service.ingestMessages({
        applicationId: APPLICATION_ID,
        input: buildInput(),
        workspaceId: WORKSPACE_ID,
      }),
    ).rejects.toThrow('is not a chat channel');
  });

  it('rejects a batch carrying the same externalId twice', async () => {
    const input = buildInput();

    input.messages = [input.messages[0], { ...input.messages[0] }];

    await expect(
      service.ingestMessages({
        applicationId: APPLICATION_ID,
        input,
        workspaceId: WORKSPACE_ID,
      }),
    ).rejects.toThrow('Duplicate externalId provider-1 in batch');

    expect(
      saveMessagesService.saveMessagesAndEnqueueContactCreation,
    ).not.toHaveBeenCalled();
  });

  it('rejects a message without exactly one sender', async () => {
    const input = buildInput();

    input.messages[0].participants = [
      {
        role: MessageParticipantRole.TO,
        handle: 'support@company.com',
      },
    ];

    await expect(
      service.ingestMessages({
        applicationId: APPLICATION_ID,
        input,
        workspaceId: WORKSPACE_ID,
      }),
    ).rejects.toThrow('must have exactly one FROM participant, got 0');
  });

  it('carries phone handles through to the save funnel', async () => {
    const input = buildInput();

    input.messages[0].participants[0].handle = '+33780123456';
    input.messages[0].participants[0].handleKind = MessageHandleKind.PHONE;

    await service.ingestMessages({
      applicationId: APPLICATION_ID,
      input,
      workspaceId: WORKSPACE_ID,
    });

    const [messages] =
      saveMessagesService.saveMessagesAndEnqueueContactCreation.mock.calls[0];

    expect(messages[0].participants[0]).toEqual({
      role: MessageParticipantRole.FROM,
      handle: '+33780123456',
      handleKind: MessageHandleKind.PHONE,
      displayName: 'Contact',
      matchHints: undefined,
    });
  });

  it('carries attachment files through to the save funnel', async () => {
    const input = buildInput();

    input.messages[0].attachments = [
      {
        fileId: '20202020-0000-0000-0000-000000000010',
        label: 'invoice.pdf',
      },
    ];

    await service.ingestMessages({
      applicationId: APPLICATION_ID,
      input,
      workspaceId: WORKSPACE_ID,
    });

    const [messages] =
      saveMessagesService.saveMessagesAndEnqueueContactCreation.mock.calls[0];

    expect(messages[0].attachmentFiles).toEqual([
      {
        fileId: '20202020-0000-0000-0000-000000000010',
        label: 'invoice.pdf',
      },
    ]);
  });

  it('leaves attachmentFiles unset when the message carries no attachment', async () => {
    await service.ingestMessages({
      applicationId: APPLICATION_ID,
      input: buildInput(),
      workspaceId: WORKSPACE_ID,
    });

    const [messages] =
      saveMessagesService.saveMessagesAndEnqueueContactCreation.mock.calls[0];

    expect(messages[0].attachmentFiles).toBeUndefined();
  });

  it('rejects a message referencing the same attachment file twice', async () => {
    const input = buildInput();

    input.messages[0].attachments = [
      { fileId: '20202020-0000-0000-0000-000000000010', label: 'invoice.pdf' },
      { fileId: '20202020-0000-0000-0000-000000000010', label: 'copy.pdf' },
    ];

    await expect(
      service.ingestMessages({
        applicationId: APPLICATION_ID,
        input,
        workspaceId: WORKSPACE_ID,
      }),
    ).rejects.toThrow('references the same attachment file twice');

    expect(
      saveMessagesService.saveMessagesAndEnqueueContactCreation,
    ).not.toHaveBeenCalled();
  });

  it('carries external handles and their match hints through to the save funnel', async () => {
    const input = buildInput();

    input.messages[0].participants[0].handle = 'rocketchat-user-id';
    input.messages[0].participants[0].handleKind = MessageHandleKind.EXTERNAL;
    input.messages[0].participants[0].matchHints = {
      email: 'contact@example.com',
    };

    await service.ingestMessages({
      applicationId: APPLICATION_ID,
      input,
      workspaceId: WORKSPACE_ID,
    });

    const [messages] =
      saveMessagesService.saveMessagesAndEnqueueContactCreation.mock.calls[0];

    expect(messages[0].participants[0]).toEqual({
      role: MessageParticipantRole.FROM,
      handle: 'rocketchat-user-id',
      handleKind: MessageHandleKind.EXTERNAL,
      displayName: 'Contact',
      matchHints: { email: 'contact@example.com' },
    });
  });
});
