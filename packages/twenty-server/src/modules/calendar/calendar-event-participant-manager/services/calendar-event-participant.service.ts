import { Injectable } from '@nestjs/common';

import { isDefined } from 'twenty-shared/utils';
import chunk from 'lodash.chunk';
import differenceWith from 'lodash.differencewith';
import { FieldActorSource } from 'twenty-shared/types';
import { Any, In } from 'typeorm';

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { type WorkspaceEntityManager } from 'src/engine/twenty-orm/entity-manager/workspace-entity-manager';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { type CalendarChannelWorkspaceEntity } from 'src/modules/calendar/common/standard-objects/calendar-channel.workspace-entity';
import { type CalendarEventParticipantWorkspaceEntity } from 'src/modules/calendar/common/standard-objects/calendar-event-participant.workspace-entity';
import { type FetchedCalendarEventParticipant } from 'src/modules/calendar/common/types/fetched-calendar-event';
import { type ConnectedAccountWorkspaceEntity } from 'src/modules/connected-account/standard-objects/connected-account.workspace-entity';
import {
  CreateCompanyAndContactJob,
  type CreateCompanyAndContactJobData,
} from 'src/modules/contact-creation-manager/jobs/create-company-and-contact.job';
import { MatchParticipantService } from 'src/modules/match-participant/match-participant.service';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

type FetchedCalendarEventParticipantWithCalendarEventId =
  FetchedCalendarEventParticipant & {
    calendarEventId: string;
    timestamp: string;
  };

type FetchedCalendarEventParticipantWithCalendarEventIdAndExistingId =
  FetchedCalendarEventParticipantWithCalendarEventId & {
    id: string;
  };

@Injectable()
export class CalendarEventParticipantService {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly matchParticipantService: MatchParticipantService<CalendarEventParticipantWorkspaceEntity>,
    @InjectMessageQueue(MessageQueue.contactCreationQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {}

  public async upsertAndDeleteCalendarEventParticipants({
    participantsToCreate,
    participantsToUpdate,
    transactionManager,
    calendarChannel,
    connectedAccount,
    workspaceId,
  }: {
    participantsToCreate: FetchedCalendarEventParticipantWithCalendarEventId[];
    participantsToUpdate: FetchedCalendarEventParticipantWithCalendarEventId[];
    transactionManager?: WorkspaceEntityManager;
    calendarChannel: CalendarChannelWorkspaceEntity;
    connectedAccount: ConnectedAccountWorkspaceEntity;
    workspaceId: string;
  }): Promise<void> {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      authContext,
      async () => {
        const chunkedParticipantsToUpdate = chunk(participantsToUpdate, 200);

        const personRepository =
          await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
            workspaceId,
            'person',
          );

        const calendarEventParticipantRepository =
          await this.globalWorkspaceOrmManager.getRepository<CalendarEventParticipantWorkspaceEntity>(
            workspaceId,
            'calendarEventParticipant',
          );

        for (const participantsToUpdateChunk of chunkedParticipantsToUpdate) {
          const existingCalendarEventParticipants =
            await calendarEventParticipantRepository.find({
              where: {
                calendarEventId: Any(
                  participantsToUpdateChunk
                    .map((participant) => participant.calendarEventId)
                    .filter(isDefined),
                ),
              },
            });

          const {
            calendarEventParticipantsToUpdate,
            newCalendarEventParticipants,
          } = participantsToUpdateChunk.reduce<{
            calendarEventParticipantsToUpdate: FetchedCalendarEventParticipantWithCalendarEventIdAndExistingId[];
            newCalendarEventParticipants: FetchedCalendarEventParticipantWithCalendarEventId[];
          }>(
            (acc, calendarEventParticipant) => {
              const existingCalendarEventParticipant =
                existingCalendarEventParticipants.find(
                  (existingCalendarEventParticipant) =>
                    existingCalendarEventParticipant.handle ===
                      calendarEventParticipant.handle &&
                    existingCalendarEventParticipant.calendarEventId ===
                      calendarEventParticipant.calendarEventId,
                );

              if (existingCalendarEventParticipant) {
                acc.calendarEventParticipantsToUpdate.push({
                  ...calendarEventParticipant,
                  id: existingCalendarEventParticipant.id,
                });
              } else {
                acc.newCalendarEventParticipants.push(calendarEventParticipant);
              }

              return acc;
            },
            {
              calendarEventParticipantsToUpdate: [],
              newCalendarEventParticipants: [],
            },
          );

          const calendarEventParticipantsToDelete = differenceWith(
            existingCalendarEventParticipants,
            participantsToUpdateChunk,
            (existingCalendarEventParticipant, participantToUpdate) =>
              existingCalendarEventParticipant.handle ===
                participantToUpdate.handle &&
              existingCalendarEventParticipant.calendarEventId ===
                participantToUpdate.calendarEventId,
          );

          await calendarEventParticipantRepository.delete(
            {
              id: Any(
                calendarEventParticipantsToDelete.map(
                  (calendarEventParticipant) => calendarEventParticipant.id,
                ),
              ),
            },
            transactionManager,
          );

          await calendarEventParticipantRepository.updateMany(
            calendarEventParticipantsToUpdate.map((participant) => ({
              criteria: participant.id,
              partialEntity: participant,
            })),
            transactionManager,
          );

          const relatedCalendarParticipantsPeople =
            await calendarEventParticipantRepository.findBy({
              id: In(
                calendarEventParticipantsToUpdate.map(
                  (participant) => participant.id,
                ),
              ),
            });

          const peopleToUpdate = calendarEventParticipantsToUpdate
            .map((participant) => {
              const existingParticipant =
                relatedCalendarParticipantsPeople.find(
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

          participantsToCreate.push(...newCalendarEventParticipants);
        }

        const chunkedParticipantsToCreate = chunk(participantsToCreate, 200);
        const savedParticipants: CalendarEventParticipantWorkspaceEntity[] = [];

        for (const participantsToCreateChunk of chunkedParticipantsToCreate) {
          const savedParticipantsChunk =
            await calendarEventParticipantRepository.insert(
              participantsToCreateChunk,
              transactionManager,
            );

          savedParticipants.push(...savedParticipantsChunk.raw);
        }

        if (calendarChannel.isContactAutoCreationEnabled) {
          await this.messageQueueService.add<CreateCompanyAndContactJobData>(
            CreateCompanyAndContactJob.name,
            {
              workspaceId,
              connectedAccount,
              contactsToCreate: savedParticipants.map((participant) => ({
                handle: participant.handle ?? '',
                displayName:
                  participant.displayName ?? participant.handle ?? '',
                timestamp: null, // TODO: fix
              })),
              source: FieldActorSource.CALENDAR,
            },
          );
        }

        await this.matchParticipantService.matchParticipants({
          participants: savedParticipants,
          objectMetadataName: 'calendarEventParticipant',
          transactionManager,
          matchWith: 'workspaceMemberAndPerson',
          workspaceId,
        });
      },
    );
  }
}
