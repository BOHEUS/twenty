import { Injectable } from '@nestjs/common';

import { MessageHandleKind } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { In } from 'typeorm';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { type WorkspaceTransactionScope } from 'src/engine/twenty-orm/global-workspace-datasource/types/workspace-transaction-scope.type';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { MatchParticipantService } from 'src/modules/match-participant/match-participant.service';
import { type MessageParticipantWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';
import { type ParticipantWithMessageId } from 'src/modules/messaging/message-import-manager/drivers/gmail/types/gmail-message.type';

@Injectable()
export class MessagingMessageParticipantService {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly matchParticipantService: MatchParticipantService<MessageParticipantWorkspaceEntity>,
  ) {}

  public async saveMessageParticipants(
    participants: ParticipantWithMessageId[],
    workspaceId: string,
    transactionScope: WorkspaceTransactionScope,
  ): Promise<void> {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const messageParticipantRepository =
          transactionScope.getRepository<MessageParticipantWorkspaceEntity>(
            'messageParticipant',
          );

        const existingParticipantsBasedOnMessageIds =
          await messageParticipantRepository.find({
            where: {
              messageId: In(
                participants.map((participant) => participant.messageId),
              ),
            },
          });

        const participantsToCreate: Pick<
          MessageParticipantWorkspaceEntity,
          'messageId' | 'handle' | 'handleKind' | 'displayName' | 'role'
        >[] = participants
          .filter(
            (participant) =>
              !existingParticipantsBasedOnMessageIds.find(
                (existingParticipant) =>
                  existingParticipant.messageId === participant.messageId &&
                  existingParticipant.handle === participant.handle &&
                  existingParticipant.displayName === participant.displayName &&
                  existingParticipant.role === participant.role,
              ),
          )
          .map((participant) => {
            return {
              messageId: participant.messageId,
              handle: participant.handle,
              handleKind: participant.handleKind ?? MessageHandleKind.EMAIL,
              displayName: participant.displayName,
              role: participant.role,
            };
          });

        const { identifiers } =
          await messageParticipantRepository.insert(participantsToCreate);

        const createdParticipants = await messageParticipantRepository.find({
          where: { id: In(identifiers.map(({ id }) => id)) },
        });

        // Hints are not persisted on the participant, so they have to travel
        // with the call that matches the rows we just inserted.
        const matchHintsByHandle = new Map(
          participants.flatMap((participant) =>
            isDefined(participant.matchHints)
              ? [[participant.handle, participant.matchHints] as const]
              : [],
          ),
        );

        await this.matchParticipantService.matchParticipants({
          participants: createdParticipants,
          objectMetadataName: 'messageParticipant',
          matchWith: 'workspaceMemberAndPerson',
          workspaceId,
          transactionScope,
          matchHintsByHandle,
        });
      },
      authContext,
      { lite: true },
    );
  }
}
