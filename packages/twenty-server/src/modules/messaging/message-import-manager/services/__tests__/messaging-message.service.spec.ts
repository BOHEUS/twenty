import { Test, type TestingModule } from '@nestjs/testing';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { type WorkspaceTransactionScope } from 'src/engine/twenty-orm/global-workspace-datasource/types/workspace-transaction-scope.type';
import { MessageDirection } from 'src/modules/messaging/common/enums/message-direction.enum';
import { MessagingMessageService } from 'src/modules/messaging/message-import-manager/services/messaging-message.service';
import { type MessageWithParticipants } from 'src/modules/messaging/message-import-manager/types/message';

const WORKSPACE_ID = '20202020-0000-0000-0000-000000000001';
const MESSAGE_CHANNEL_ID = '20202020-0000-0000-0000-000000000003';

describe('MessagingMessageService', () => {
  let service: MessagingMessageService;
  let messageRepository: { find: jest.Mock; insert: jest.Mock };
  let transactionScope: WorkspaceTransactionScope;

  const buildMessage = (
    overrides: Partial<MessageWithParticipants> = {},
  ): MessageWithParticipants => ({
    externalId: 'provider-1',
    headerMessageId: `${MESSAGE_CHANNEL_ID}:provider-1`,
    messageThreadExternalId: 'thread-1',
    direction: MessageDirection.INCOMING,
    subject: '',
    text: 'hello',
    receivedAt: new Date('2026-01-01T00:00:00.000Z'),
    isDraft: false,
    attachments: [],
    participants: [],
    ...overrides,
  });

  beforeEach(async () => {
    messageRepository = {
      find: jest.fn().mockResolvedValue([]),
      insert: jest.fn().mockResolvedValue(undefined),
    };

    const repositories: Record<string, unknown> = {
      message: messageRepository,
      messageThread: {
        insert: jest.fn().mockResolvedValue(undefined),
        upsert: jest.fn().mockResolvedValue(undefined),
      },
      messageChannelMessageAssociation: {
        find: jest.fn().mockResolvedValue([]),
        insert: jest.fn().mockResolvedValue(undefined),
      },
    };

    transactionScope = {
      getRepository: jest.fn((objectName: string) => repositories[objectName]),
    } as unknown as WorkspaceTransactionScope;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagingMessageService,
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: {
            executeInWorkspaceContext: jest.fn((callback) => callback()),
          },
        },
      ],
    }).compile();

    service = module.get(MessagingMessageService);
  });

  it('persists the attachment files carried by the message', async () => {
    const attachmentFiles = [
      { fileId: '20202020-0000-0000-0000-000000000010', label: 'invoice.pdf' },
    ];

    await service.saveMessagesWithinTransaction(
      [buildMessage({ attachmentFiles })],
      MESSAGE_CHANNEL_ID,
      transactionScope,
      WORKSPACE_ID,
    );

    const [insertedMessages] = messageRepository.insert.mock.calls[0];

    expect(insertedMessages).toHaveLength(1);
    expect(insertedMessages[0].attachments).toEqual(attachmentFiles);
  });

  it('leaves attachments null when the message carries none', async () => {
    await service.saveMessagesWithinTransaction(
      [buildMessage()],
      MESSAGE_CHANNEL_ID,
      transactionScope,
      WORKSPACE_ID,
    );

    const [insertedMessages] = messageRepository.insert.mock.calls[0];

    expect(insertedMessages[0].attachments).toBeNull();
  });

  it('does not re-link attachments onto a message that already exists', async () => {
    messageRepository.find.mockResolvedValue([
      {
        id: 'existing-message-id',
        headerMessageId: `${MESSAGE_CHANNEL_ID}:provider-1`,
        messageThreadId: 'existing-thread-id',
      },
    ]);

    await service.saveMessagesWithinTransaction(
      [
        buildMessage({
          attachmentFiles: [
            {
              fileId: '20202020-0000-0000-0000-000000000010',
              label: 'invoice.pdf',
            },
          ],
        }),
      ],
      MESSAGE_CHANNEL_ID,
      transactionScope,
      WORKSPACE_ID,
    );

    const [insertedMessages] = messageRepository.insert.mock.calls[0];

    expect(insertedMessages).toEqual([]);
  });
});
