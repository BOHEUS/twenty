import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isDefined } from 'twenty-shared/utils';
import { Repository } from 'typeorm';

import { ConnectionProviderService } from 'src/engine/core-modules/application/connection-provider/connection-provider.service';
import { LogicFunctionExecutorService } from 'src/engine/core-modules/logic-function/logic-function-executor/logic-function-executor.service';
import { LogicFunctionExecutionStatus } from 'src/engine/metadata-modules/logic-function/dtos/logic-function-execution-result.dto';
import { type ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { MessageChannelEntity } from 'src/engine/metadata-modules/message-channel/entities/message-channel.entity';
import {
  MessageChannelException,
  MessageChannelExceptionCode,
} from 'src/engine/metadata-modules/message-channel/message-channel.exception';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { buildAppMessageHeaderMessageId } from 'src/modules/messaging/common/utils/build-app-message-header-message-id.util';
import { type SendAppMessagePayload } from 'src/modules/messaging/message-outbound-manager/drivers/app/types/send-app-message-payload.type';
import { parseSendAppMessageResponse } from 'src/modules/messaging/message-outbound-manager/drivers/app/utils/parse-send-app-message-response.util';
import { type MessageOutboundDriver } from 'src/modules/messaging/message-outbound-manager/interfaces/message-outbound-driver.interface';
import { type SendMessageInput } from 'src/modules/messaging/message-outbound-manager/types/send-message-input.type';
import { type SendMessageResult } from 'src/modules/messaging/message-outbound-manager/types/send-message-result.type';

@Injectable()
export class AppMessageOutboundService implements MessageOutboundDriver {
  constructor(
    private readonly connectionProviderService: ConnectionProviderService,
    private readonly logicFunctionExecutorService: LogicFunctionExecutorService,
    private readonly workspaceCacheService: WorkspaceCacheService,
    @InjectRepository(MessageChannelEntity)
    private readonly messageChannelRepository: Repository<MessageChannelEntity>,
  ) {}

  async sendMessage(
    sendMessageInput: SendMessageInput,
    connectedAccount: ConnectedAccountEntity,
  ): Promise<SendMessageResult> {
    const messageChannel = await this.resolveMessageChannel(
      sendMessageInput,
      connectedAccount,
    );

    const { provider, logicFunctionId } =
      await this.resolveSendMessageLogicFunction(connectedAccount);

    const payload: SendAppMessagePayload = {
      connectedAccountId: connectedAccount.id,
      connectionProviderId: provider.id,
      connectionProviderName: provider.name,
      messageChannelId: messageChannel.id,
      channelHandle: messageChannel.handle,
      threadExternalId: sendMessageInput.threadExternalId,
      inReplyTo: sendMessageInput.inReplyTo,
      subject: sendMessageInput.subject,
      body: sendMessageInput.body,
      html: sendMessageInput.html,
      to: toRecipientArray(sendMessageInput.to),
      cc: toRecipientArray(sendMessageInput.cc),
      bcc: toRecipientArray(sendMessageInput.bcc),
    };

    const executionResult = await this.logicFunctionExecutorService.execute({
      logicFunctionId,
      workspaceId: connectedAccount.workspaceId,
      payload,
    });

    if (executionResult.status !== LogicFunctionExecutionStatus.SUCCESS) {
      throw new MessageChannelException(
        `Application ${provider.name} failed to send the message: ${
          executionResult.error?.errorMessage ?? 'unknown error'
        }`,
        MessageChannelExceptionCode.INVALID_MESSAGE_CHANNEL_INPUT,
      );
    }

    const response = parseSendAppMessageResponse(executionResult.data);

    if (!isDefined(response)) {
      throw new MessageChannelException(
        `Application ${provider.name} did not return an externalId for the message it sent.`,
        MessageChannelExceptionCode.INVALID_MESSAGE_CHANNEL_INPUT,
      );
    }

    return {
      headerMessageId: buildAppMessageHeaderMessageId({
        messageChannelId: messageChannel.id,
        externalId: response.externalId,
      }),
      messageExternalId: response.externalId,
      threadExternalId:
        response.threadExternalId ?? sendMessageInput.threadExternalId,
    };
  }

  async createDraft(): Promise<void> {
    throw new MessageChannelException(
      'Chat channels do not support drafts.',
      MessageChannelExceptionCode.INVALID_MESSAGE_CHANNEL_INPUT,
    );
  }

  async sendDraft(): Promise<SendMessageResult> {
    throw new MessageChannelException(
      'Chat channels do not support drafts.',
      MessageChannelExceptionCode.INVALID_MESSAGE_CHANNEL_INPUT,
    );
  }

  // One account fronts several channels, so the caller has to say which of the
  // company's numbers is sending; falling back to the account's only channel
  // keeps single-channel providers from having to.
  private async resolveMessageChannel(
    sendMessageInput: SendMessageInput,
    connectedAccount: ConnectedAccountEntity,
  ): Promise<MessageChannelEntity> {
    if (isDefined(sendMessageInput.messageChannelId)) {
      const messageChannel = await this.messageChannelRepository.findOne({
        where: {
          id: sendMessageInput.messageChannelId,
          connectedAccountId: connectedAccount.id,
          workspaceId: connectedAccount.workspaceId,
        },
      });

      if (!isDefined(messageChannel)) {
        throw new MessageChannelException(
          `Message channel ${sendMessageInput.messageChannelId} does not belong to connected account ${connectedAccount.id}.`,
          MessageChannelExceptionCode.MESSAGE_CHANNEL_NOT_FOUND,
        );
      }

      return messageChannel;
    }

    const messageChannels = await this.messageChannelRepository.find({
      where: {
        connectedAccountId: connectedAccount.id,
        workspaceId: connectedAccount.workspaceId,
      },
    });

    if (messageChannels.length !== 1) {
      throw new MessageChannelException(
        `Connected account ${connectedAccount.id} has ${messageChannels.length} channels, so the message must name the one it is sent from.`,
        MessageChannelExceptionCode.INVALID_MESSAGE_CHANNEL_INPUT,
      );
    }

    return messageChannels[0];
  }

  private async resolveSendMessageLogicFunction(
    connectedAccount: ConnectedAccountEntity,
  ): Promise<{
    provider: { id: string; name: string };
    logicFunctionId: string;
  }> {
    if (!isDefined(connectedAccount.connectionProviderId)) {
      throw new MessageChannelException(
        `Connected account ${connectedAccount.id} has no connection provider to send through.`,
        MessageChannelExceptionCode.INVALID_MESSAGE_CHANNEL_INPUT,
      );
    }

    const provider = await this.connectionProviderService.findOneByIdOrThrow(
      connectedAccount.connectionProviderId,
    );

    const universalIdentifier =
      provider.onSendMessageLogicFunctionUniversalIdentifier;

    if (!isDefined(universalIdentifier)) {
      throw new MessageChannelException(
        `Connection provider ${provider.name} does not declare an onSendMessageLogicFunction.`,
        MessageChannelExceptionCode.INVALID_MESSAGE_CHANNEL_INPUT,
      );
    }

    const { flatLogicFunctionMaps } =
      await this.workspaceCacheService.getOrRecompute(
        connectedAccount.workspaceId,
        ['flatLogicFunctionMaps'],
      );

    const flatLogicFunction =
      flatLogicFunctionMaps.byUniversalIdentifier[universalIdentifier];

    if (
      !isDefined(flatLogicFunction) ||
      isDefined(flatLogicFunction.deletedAt)
    ) {
      throw new MessageChannelException(
        `Connection provider ${provider.name} references onSendMessage logic function ${universalIdentifier}, which was not found in workspace ${connectedAccount.workspaceId}.`,
        MessageChannelExceptionCode.INVALID_MESSAGE_CHANNEL_INPUT,
      );
    }

    return {
      provider: { id: provider.id, name: provider.name },
      logicFunctionId: flatLogicFunction.id,
    };
  }
}

const toRecipientArray = (value: string | string[] | undefined): string[] => {
  if (!isDefined(value)) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};
