import { Injectable } from '@nestjs/common';

import {
  FieldActorSource,
  MessageChannelContactAutoCreationPolicy,
  MessageHandleKind,
  MessageParticipantRole,
} from 'twenty-shared/types';
import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'twenty-shared/utils';

import { type MessageChannelEntity } from 'src/engine/metadata-modules/message-channel/entities/message-channel.entity';
import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { type ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import {
  CreateCompanyAndContactJob,
  type CreateCompanyAndContactJobData,
} from 'src/modules/contact-creation-manager/jobs/create-company-and-contact.job';
import {
  type Participant,
  type ParticipantWithMessageId,
} from 'src/modules/messaging/message-import-manager/drivers/gmail/types/gmail-message.type';
import { MessagingMessageFolderAssociationService } from 'src/modules/messaging/message-import-manager/services/messaging-message-folder-association.service';
import { MessagingMessageService } from 'src/modules/messaging/message-import-manager/services/messaging-message.service';
import { type MessageChannelMessageAssociationFolderAssociation } from 'src/modules/messaging/message-import-manager/types/message-channel-message-association-folder-association.type';
import { type MessageWithParticipants } from 'src/modules/messaging/message-import-manager/types/message';
import { isGroupEmail } from 'src/modules/messaging/message-import-manager/utils/is-group-email';
import { MessagingMessageParticipantService } from 'src/modules/messaging/message-participant-manager/services/messaging-message-participant.service';
import { isWorkEmail } from 'src/utils/is-work-email';

@Injectable()
export class MessagingSaveMessagesAndEnqueueContactCreationService {
  constructor(
    @InjectMessageQueue(MessageQueue.contactCreationQueue)
    private readonly messageQueueService: MessageQueueService,
    private readonly messageService: MessagingMessageService,
    private readonly messageParticipantService: MessagingMessageParticipantService,
    private readonly messageFolderAssociationService: MessagingMessageFolderAssociationService,
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async saveMessagesAndEnqueueContactCreation(
    messagesToSave: MessageWithParticipants[],
    messageChannel: MessageChannelEntity,
    connectedAccount: ConnectedAccountEntity,
    workspaceId: string,
  ): Promise<
    | {
        messageExternalIdsAndIdsMap: Map<string, string>;
        messageExternalIdToMessageThreadIdMap: Map<string, string>;
        createdMessageIds: Set<string>;
      }
    | undefined
  > {
    const handleAliases = connectedAccount.handleAliases || [];
    // One connected account can front several channels (a WhatsApp Business
    // Account holds many numbers), so "us" means the channel's own handle as
    // well as the account's, or our other numbers look like inbound contacts.
    const ownHandles = new Set(
      [messageChannel.handle, connectedAccount.handle, ...handleAliases].filter(
        isNonEmptyString,
      ),
    );
    const authContext = buildSystemAuthContext(workspaceId);

    const savedMessagesResult =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          return this.globalWorkspaceOrmManager.runInWorkspaceTransaction(
            async (transactionScope) => {
              const {
                createdMessages,
                messageExternalIdsAndIdsMap,
                messageExternalIdToMessageChannelMessageAssociationIdMap,
                messageExternalIdToMessageThreadIdMap,
              } = await this.messageService.saveMessagesWithinTransaction(
                messagesToSave,
                messageChannel.id,
                transactionScope,
                workspaceId,
              );

              const participantsWithMessageId: (ParticipantWithMessageId & {
                shouldCreateContact: boolean;
              })[] = messagesToSave.flatMap((message) => {
                const messageId = messageExternalIdsAndIdsMap.get(
                  message.externalId,
                );

                return messageId
                  ? message.participants.map((participant: Participant) => {
                      const fromHandle =
                        message.participants.find(
                          (p) => p.role === MessageParticipantRole.FROM,
                        )?.handle || '';

                      const isMessageSentByConnectedAccount =
                        ownHandles.has(fromHandle);

                      const isParticipantConnectedAccount = ownHandles.has(
                        participant.handle,
                      );

                      // Both filters read the handle as an email address, so
                      // they can only speak for participants whose handle is one.
                      const isEmailHandle =
                        (participant.handleKind ?? MessageHandleKind.EMAIL) ===
                        MessageHandleKind.EMAIL;

                      const isExcludedByNonProfessionalEmails =
                        isEmailHandle &&
                        messageChannel.excludeNonProfessionalEmails &&
                        !isWorkEmail(participant.handle);

                      const isExcludedByGroupEmails =
                        isEmailHandle &&
                        messageChannel.excludeGroupEmails &&
                        isGroupEmail(participant.handle);

                      // Drafts are outgoing, so don't turn recipients of an
                      // unsent email into CRM contacts.
                      const shouldCreateContact =
                        !message.isDraft &&
                        !!participant.handle &&
                        !isParticipantConnectedAccount &&
                        !isExcludedByNonProfessionalEmails &&
                        !isExcludedByGroupEmails &&
                        (messageChannel.contactAutoCreationPolicy ===
                          MessageChannelContactAutoCreationPolicy.SENT_AND_RECEIVED ||
                          (messageChannel.contactAutoCreationPolicy ===
                            MessageChannelContactAutoCreationPolicy.SENT &&
                            isMessageSentByConnectedAccount));

                      return {
                        ...participant,
                        messageId,
                        shouldCreateContact,
                      };
                    })
                  : [];
              });

              await this.messageParticipantService.saveMessageParticipants(
                participantsWithMessageId,
                workspaceId,
                transactionScope,
              );

              const folderAssociations: MessageChannelMessageAssociationFolderAssociation[] =
                messagesToSave.flatMap((message) => {
                  const messageFolderIds = message.messageFolderIds ?? [];

                  if (messageFolderIds.length === 0) {
                    return [];
                  }

                  const associationId =
                    messageExternalIdToMessageChannelMessageAssociationIdMap.get(
                      message.externalId,
                    );

                  if (!isDefined(associationId)) {
                    return [];
                  }

                  return [
                    {
                      messageChannelMessageAssociationId: associationId,
                      messageFolderIds,
                    },
                  ];
                });

              await this.messageFolderAssociationService.saveMessageFolderAssociations(
                folderAssociations,
                workspaceId,
                transactionScope,
              );

              return {
                participantsWithMessageId,
                messageExternalIdsAndIdsMap,
                messageExternalIdToMessageThreadIdMap,
                createdMessageIds: new Set(
                  createdMessages
                    .map((message) => message.id)
                    .filter(isDefined),
                ),
              };
            },
          );
        },
        authContext,
        { lite: true },
      );

    if (messageChannel.isContactAutoCreationEnabled && savedMessagesResult) {
      const contactsToCreate =
        savedMessagesResult.participantsWithMessageId.filter(
          (participant) => participant.shouldCreateContact,
        );

      await this.messageQueueService.add<CreateCompanyAndContactJobData>(
        CreateCompanyAndContactJob.name,
        {
          workspaceId,
          connectedAccount,
          contactsToCreate,
          source: FieldActorSource.EMAIL,
        },
      );
    }

    if (!isDefined(savedMessagesResult)) {
      return undefined;
    }

    return {
      messageExternalIdsAndIdsMap:
        savedMessagesResult.messageExternalIdsAndIdsMap,
      messageExternalIdToMessageThreadIdMap:
        savedMessagesResult.messageExternalIdToMessageThreadIdMap,
      createdMessageIds: savedMessagesResult.createdMessageIds,
    };
  }
}
