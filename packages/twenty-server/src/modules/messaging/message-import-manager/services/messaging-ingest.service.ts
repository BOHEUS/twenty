import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  MessageChannelType,
  MessageHandleKind,
  MessageParticipantRole,
} from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { Repository } from 'typeorm';

import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UserInputError,
} from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { MessageChannelEntity } from 'src/engine/metadata-modules/message-channel/entities/message-channel.entity';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { buildAppMessageHeaderMessageId } from 'src/modules/messaging/common/utils/build-app-message-header-message-id.util';
import {
  type IngestMessageInput,
  type IngestMessagesInput,
} from 'src/modules/messaging/message-import-manager/dtos/ingest-messages.input';
import { type IngestMessagesOutput } from 'src/modules/messaging/message-import-manager/dtos/ingest-messages.output';
import { MessagingSaveMessagesAndEnqueueContactCreationService } from 'src/modules/messaging/message-import-manager/services/messaging-save-messages-and-enqueue-contact-creation.service';
import { type MessageWithParticipants } from 'src/modules/messaging/message-import-manager/types/message';

@Injectable()
export class MessagingIngestService {
  constructor(
    @InjectRepository(MessageChannelEntity)
    private readonly messageChannelRepository: Repository<MessageChannelEntity>,
    @InjectRepository(ConnectedAccountEntity)
    private readonly connectedAccountRepository: Repository<ConnectedAccountEntity>,
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly saveMessagesAndEnqueueContactCreationService: MessagingSaveMessagesAndEnqueueContactCreationService,
  ) {}

  async ingestMessages({
    applicationId,
    input,
    workspaceId,
  }: {
    applicationId: string;
    input: IngestMessagesInput;
    workspaceId: string;
  }): Promise<IngestMessagesOutput> {
    const { messageChannel, connectedAccount } = await this.resolveAppChannel({
      applicationId,
      messageChannelId: input.messageChannelId,
      workspaceId,
    });

    this.validateBatch(input.messages);

    const messagesToSave = input.messages.map((message) =>
      this.buildMessageWithParticipants(message, messageChannel.id),
    );

    const savedMessages =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () =>
          this.saveMessagesAndEnqueueContactCreationService.saveMessagesAndEnqueueContactCreation(
            messagesToSave,
            messageChannel,
            connectedAccount,
            workspaceId,
          ),
        buildSystemAuthContext(workspaceId),
        { lite: true },
      );

    if (!isDefined(savedMessages)) {
      throw new InternalServerError('Failed to ingest messages');
    }

    const results = messagesToSave.flatMap((message) => {
      const messageId = savedMessages.messageExternalIdsAndIdsMap.get(
        message.externalId,
      );
      const messageThreadId =
        savedMessages.messageExternalIdToMessageThreadIdMap.get(
          message.externalId,
        );

      if (!isDefined(messageId) || !isDefined(messageThreadId)) {
        return [];
      }

      return [
        {
          externalId: message.externalId,
          messageId,
          messageThreadId,
          created: savedMessages.createdMessageIds.has(messageId),
        },
      ];
    });

    return { results };
  }

  private async resolveAppChannel({
    applicationId,
    messageChannelId,
    workspaceId,
  }: {
    applicationId: string;
    messageChannelId: string;
    workspaceId: string;
  }): Promise<{
    messageChannel: MessageChannelEntity;
    connectedAccount: ConnectedAccountEntity;
  }> {
    const messageChannel = await this.messageChannelRepository.findOne({
      where: { id: messageChannelId, workspaceId },
    });

    if (!isDefined(messageChannel)) {
      throw new NotFoundError(`Message channel ${messageChannelId} not found`);
    }

    if (messageChannel.type !== MessageChannelType.CHAT) {
      throw new ForbiddenError(
        `Message channel ${messageChannelId} is not a chat channel`,
      );
    }

    const connectedAccount = await this.connectedAccountRepository.findOne({
      where: { id: messageChannel.connectedAccountId, workspaceId },
    });

    if (
      !isDefined(connectedAccount) ||
      connectedAccount.applicationId !== applicationId
    ) {
      throw new ForbiddenError(
        `Message channel ${messageChannelId} is not owned by application ${applicationId}`,
      );
    }

    return { messageChannel, connectedAccount };
  }

  private validateBatch(messages: IngestMessageInput[]): void {
    const seenExternalIds = new Set<string>();

    for (const message of messages) {
      // Two entries sharing an externalId would collapse onto one message and
      // silently attach both participant sets to it.
      if (seenExternalIds.has(message.externalId)) {
        throw new UserInputError(
          `Duplicate externalId ${message.externalId} in batch`,
        );
      }

      seenExternalIds.add(message.externalId);

      const senderCount = message.participants.filter(
        (participant) => participant.role === MessageParticipantRole.FROM,
      ).length;

      if (senderCount !== 1) {
        throw new UserInputError(
          `Message ${message.externalId} must have exactly one FROM participant, got ${senderCount}`,
        );
      }

      const attachmentFileIds = (message.attachments ?? []).map(
        (attachment) => attachment.fileId,
      );

      if (new Set(attachmentFileIds).size !== attachmentFileIds.length) {
        throw new UserInputError(
          `Message ${message.externalId} references the same attachment file twice`,
        );
      }
    }
  }

  private buildMessageWithParticipants(
    message: IngestMessageInput,
    messageChannelId: string,
  ): MessageWithParticipants {
    return {
      externalId: message.externalId,
      headerMessageId: buildAppMessageHeaderMessageId({
        messageChannelId,
        externalId: message.externalId,
      }),
      messageThreadExternalId: message.threadExternalId,
      direction: message.direction,
      subject: message.subject ?? '',
      text: message.text,
      receivedAt: message.receivedAt,
      isDraft: false,
      attachments: [],
      attachmentFiles: message.attachments?.map((attachment) => ({
        fileId: attachment.fileId,
        label: attachment.label,
      })),
      participants: message.participants.map((participant) => ({
        role: participant.role,
        handle: participant.handle,
        handleKind: participant.handleKind ?? MessageHandleKind.EMAIL,
        displayName: participant.displayName ?? '',
        matchHints: participant.matchHints,
      })),
    };
  }
}
