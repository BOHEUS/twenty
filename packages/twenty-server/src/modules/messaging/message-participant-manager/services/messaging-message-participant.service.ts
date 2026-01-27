import { Injectable } from '@nestjs/common';

import { In } from 'typeorm';
import { isDefined } from 'twenty-shared/utils';

import { type WorkspaceEntityManager } from 'src/engine/twenty-orm/entity-manager/workspace-entity-manager';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { MatchParticipantService } from 'src/modules/match-participant/match-participant.service';
import { type MessageParticipantWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';
import { type ParticipantWithMessageId } from 'src/modules/messaging/message-import-manager/drivers/gmail/types/gmail-message.type';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

@Injectable()
export class MessagingMessageParticipantService {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly matchParticipantService: MatchParticipantService<MessageParticipantWorkspaceEntity>,
  ) {}

  public async saveMessageParticipants(
    participants: ParticipantWithMessageId[],
    workspaceId: string,
    transactionManager?: WorkspaceEntityManager,
  ): Promise<void> {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      authContext,
      async () => {
        const messageParticipantRepository =
          await this.globalWorkspaceOrmManager.getRepository<MessageParticipantWorkspaceEntity>(
            workspaceId,
            'messageParticipant',
          );

        const personRepository =
          await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
            workspaceId,
            'person',
          );

        const existingParticipantsBasedOnMessageIds =
          await messageParticipantRepository.find({
            where: {
              messageId: In(
                participants.map((participant) => participant.messageId),
              ),
            },
          });

        const relatedCalendarParticipantsPeople =
          await messageParticipantRepository.findBy({
            id: In(
              existingParticipantsBasedOnMessageIds.map(
                (participant) => participant.id,
              ),
            ),
          });

        const peopleToUpdate = calendarEventParticipantsToUpdate
          .map((participant) => {
            const existingParticipant = relatedCalendarParticipantsPeople.find(
              (t) => t.id === participant.id,
            );

            if (
              isDefined(existingParticipant) &&
              isDefined(existingParticipant?.personId)
            ) {
              return {
                id: existingParticipant.personId,
                timestamp: participant.timestamp,
              };
            }
          })
          .filter((participant) => participant !== undefined);

        const fetchedPeople = await personRepository.findBy({
          id: In(peopleToUpdate.map((person) => person.id)),
        });

        for (const person of fetchedPeople) {
          const timestamp = peopleToUpdate.filter(
            (personToCheck) => personToCheck.id === person.id,
          )[0];

          if (
            person.lastInteraction === null ||
            person.lastInteraction < timestamp.timestamp
          ) {
            await personRepository.update(
              {
                id: timestamp.id,
              },
              {
                lastInteraction: timestamp.timestamp,
              },
            );
          }
        }

        await personRepository.updateMany(
          peopleToUpdate.map((participant) => ({
            criteria: participant.id,
            partialEntity: {
              lastInteraction: participant.timestamp,
            },
          })),
        );

        const participantsToCreate: Pick<
          MessageParticipantWorkspaceEntity,
          'messageId' | 'handle' | 'displayName' | 'role'
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
              displayName: participant.displayName,
              role: participant.role,
            };
          });

        const createdParticipants = await messageParticipantRepository.insert(
          participantsToCreate,
          transactionManager,
        );

        await this.matchParticipantService.matchParticipants({
          participants: createdParticipants.raw ?? [],
          objectMetadataName: 'messageParticipant',
          transactionManager,
          matchWith: 'workspaceMemberAndPerson',
          workspaceId,
        });
      },
    );
  }
}
