import { Injectable } from '@nestjs/common';

import { isNonEmptyString } from '@sniptt/guards';
import chunk from 'lodash.chunk';
import { MessageHandleKind } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { Any, In } from 'typeorm';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { type WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { type WorkspaceTransactionScope } from 'src/engine/twenty-orm/global-workspace-datasource/types/workspace-transaction-scope.type';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';
import { type CalendarEventParticipantWorkspaceEntity } from 'src/modules/calendar/common/standard-objects/calendar-event-participant.workspace-entity';
import { addPersonEmailFiltersToQueryBuilder } from 'src/modules/match-participant/utils/add-person-email-filters-to-query-builder';
import { addPersonPhoneFiltersToQueryBuilder } from 'src/modules/match-participant/utils/add-person-phone-filters-to-query-builder';
import { findPersonByPrimaryOrAdditionalEmail } from 'src/modules/match-participant/utils/find-person-by-primary-or-additional-email';
import { findPersonByPrimaryOrAdditionalPhone } from 'src/modules/match-participant/utils/find-person-by-primary-or-additional-phone';
import { findPersonIdsByRememberedHandles } from 'src/modules/match-participant/utils/find-person-ids-by-remembered-handles.util';
import { type ParticipantMatchHints } from 'src/modules/match-participant/types/participant-match-hints.type';
import { type MessageParticipantWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

type ObjectMetadataName = 'messageParticipant' | 'calendarEventParticipant';

type GetParticipantRepositoryArgs = {
  workspaceId: string;
  objectMetadataName: ObjectMetadataName;
  transactionScope?: WorkspaceTransactionScope;
};

type MatchParticipantsForWorkspaceMembersArgs = {
  participantMatching: {
    workspaceMemberIds: string[];
  };
  objectMetadataName: ObjectMetadataName;
  workspaceId: string;
};

type MatchParticipantsForPeopleArgs = {
  participantMatching: {
    personIds: string[];
    personEmails: string[];
    personPhoneHandles?: string[];
    participantExternalHandles?: string[];
  };
  objectMetadataName: ObjectMetadataName;
  workspaceId: string;
};

type MatchParticipantsArgs<
  ParticipantWorkspaceEntity extends
    | Pick<
        CalendarEventParticipantWorkspaceEntity,
        'id' | 'handle' | 'workspaceMemberId' | 'personId' | 'calendarEventId'
      >
    | Pick<
        MessageParticipantWorkspaceEntity,
        'id' | 'handle' | 'workspaceMemberId' | 'personId' | 'messageId'
      >,
> = {
  participants: ParticipantWorkspaceEntity[];
  objectMetadataName: ObjectMetadataName;
  matchWith: 'workspaceMemberOnly' | 'personOnly' | 'workspaceMemberAndPerson';
  workspaceId: string;
  transactionScope?: WorkspaceTransactionScope;
  matchHintsByHandle?: Map<string, ParticipantMatchHints>;
};

// Calendar participants have no handleKind column and are always email
// addresses, so an absent kind reads as EMAIL.
const getParticipantHandleKind = (participant: {
  handle?: string | null;
  handleKind?: MessageHandleKind;
}): MessageHandleKind => participant.handleKind ?? MessageHandleKind.EMAIL;

const collectUniqueHandlesByKind = (
  participants: { handle?: string | null; handleKind?: MessageHandleKind }[],
  handleKind: MessageHandleKind,
): string[] => [
  ...new Set(
    participants
      .filter(
        (participant) => getParticipantHandleKind(participant) === handleKind,
      )
      .map((participant) => participant.handle)
      .filter(isNonEmptyString),
  ),
];

@Injectable()
export class MatchParticipantService<
  ParticipantWorkspaceEntity extends
    | CalendarEventParticipantWorkspaceEntity
    | MessageParticipantWorkspaceEntity,
> {
  constructor(
    private readonly workspaceEventEmitter: WorkspaceEventEmitter,
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  private async getParticipantRepository({
    workspaceId,
    objectMetadataName,
    transactionScope,
  }: GetParticipantRepositoryArgs) {
    if (objectMetadataName === 'messageParticipant') {
      if (isDefined(transactionScope)) {
        return transactionScope.getRepository<MessageParticipantWorkspaceEntity>(
          objectMetadataName,
        );
      }

      return await this.globalWorkspaceOrmManager.getRepository<MessageParticipantWorkspaceEntity>(
        workspaceId,
        objectMetadataName,
      );
    }

    if (isDefined(transactionScope)) {
      return transactionScope.getRepository<CalendarEventParticipantWorkspaceEntity>(
        objectMetadataName,
      );
    }

    return await this.globalWorkspaceOrmManager.getRepository<CalendarEventParticipantWorkspaceEntity>(
      workspaceId,
      objectMetadataName,
    );
  }

  // Tiers, in order: an address the provider handed us alongside the opaque id,
  // then the person some earlier participant with the same handle was linked to.
  private resolveMatchedPersonId({
    handle,
    handleKind,
    matchHints,
    peopleMatchingEmails,
    peopleMatchingPhones,
    personIdByRememberedHandle,
  }: {
    handle: string;
    handleKind: MessageHandleKind;
    matchHints: ParticipantMatchHints | undefined;
    peopleMatchingEmails: PersonWorkspaceEntity[];
    peopleMatchingPhones: PersonWorkspaceEntity[];
    personIdByRememberedHandle: Map<string, string>;
  }): string | null {
    if (handleKind === MessageHandleKind.PHONE) {
      return (
        findPersonByPrimaryOrAdditionalPhone({
          people: peopleMatchingPhones,
          phone: handle,
        })?.id ?? null
      );
    }

    if (handleKind === MessageHandleKind.EMAIL) {
      return (
        findPersonByPrimaryOrAdditionalEmail({
          people: peopleMatchingEmails,
          email: handle,
        })?.id ?? null
      );
    }

    if (isNonEmptyString(matchHints?.email)) {
      const personFromEmailHint = findPersonByPrimaryOrAdditionalEmail({
        people: peopleMatchingEmails,
        email: matchHints.email,
      });

      if (isDefined(personFromEmailHint)) {
        return personFromEmailHint.id;
      }
    }

    if (isNonEmptyString(matchHints?.phone)) {
      const personFromPhoneHint = findPersonByPrimaryOrAdditionalPhone({
        people: peopleMatchingPhones,
        phone: matchHints.phone,
      });

      if (isDefined(personFromPhoneHint)) {
        return personFromPhoneHint.id;
      }
    }

    return personIdByRememberedHandle.get(handle) ?? null;
  }

  public async matchParticipants({
    participants,
    objectMetadataName,
    matchWith = 'workspaceMemberAndPerson',
    workspaceId,
    transactionScope,
    matchHintsByHandle,
  }: MatchParticipantsArgs<ParticipantWorkspaceEntity>) {
    if (participants.length === 0) {
      return;
    }

    const personRepository =
      await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
        workspaceId,
        'person',
        { shouldBypassPermissionChecks: true },
      );

    const participantRepository = await this.getParticipantRepository({
      workspaceId,
      objectMetadataName,
      transactionScope,
    });

    const workspaceMemberRepository =
      await this.globalWorkspaceOrmManager.getRepository<WorkspaceMemberWorkspaceEntity>(
        workspaceId,
        'workspaceMember',
        { shouldBypassPermissionChecks: true },
      );

    const chunkSize = 200;
    const chunkedParticipants = chunk(participants, chunkSize);

    for (const participants of chunkedParticipants) {
      const uniqueEmailHandles = collectUniqueHandlesByKind(
        participants,
        MessageHandleKind.EMAIL,
      );
      const uniquePhoneHandles = collectUniqueHandlesByKind(
        participants,
        MessageHandleKind.PHONE,
      );
      const uniqueExternalHandles = collectUniqueHandlesByKind(
        participants,
        MessageHandleKind.EXTERNAL,
      );

      const hintedHandles = uniqueExternalHandles.flatMap(
        (handle) => matchHintsByHandle?.get(handle) ?? [],
      );

      // Hinted addresses join the queries the batch already runs rather than
      // adding their own.
      const emailsToLookUp = [
        ...new Set([
          ...uniqueEmailHandles,
          ...hintedHandles.map((hints) => hints.email).filter(isNonEmptyString),
        ]),
      ];
      const phonesToLookUp = [
        ...new Set([
          ...uniquePhoneHandles,
          ...hintedHandles.map((hints) => hints.phone).filter(isNonEmptyString),
        ]),
      ];

      const peopleMatchingEmails =
        emailsToLookUp.length > 0
          ? await addPersonEmailFiltersToQueryBuilder({
              queryBuilder: personRepository.createQueryBuilder('person'),
              emails: emailsToLookUp,
            })
              .orderBy('person.createdAt', 'ASC')
              .getMany()
          : [];

      const peopleMatchingPhones =
        phonesToLookUp.length > 0
          ? await addPersonPhoneFiltersToQueryBuilder({
              queryBuilder: personRepository.createQueryBuilder('person'),
              phones: phonesToLookUp,
            })
              .orderBy('person.createdAt', 'ASC')
              .getMany()
          : [];

      const personIdByRememberedHandle =
        objectMetadataName === 'messageParticipant'
          ? await findPersonIdsByRememberedHandles({
              participantRepository:
                participantRepository as WorkspaceRepository<MessageParticipantWorkspaceEntity>,
              handles: uniqueExternalHandles,
            })
          : new Map<string, string>();

      // Only an email can identify a member: workspaceMember has no phone field.
      const workspaceMembers =
        uniqueEmailHandles.length > 0
          ? await workspaceMemberRepository.find({
              where: {
                userEmail: Any(uniqueEmailHandles),
              },
            })
          : [];

      const partipantsToBeUpdated = participants
        .map((participant) => ({
          ...participant,
          handle: participant.handle ?? '',
        }))
        .map((participant) => {
          const handleKind = getParticipantHandleKind(participant);

          const matchedPersonId = this.resolveMatchedPersonId({
            handle: participant.handle,
            handleKind,
            matchHints: matchHintsByHandle?.get(participant.handle),
            peopleMatchingEmails,
            peopleMatchingPhones,
            personIdByRememberedHandle,
          });

          const workspaceMember =
            handleKind === MessageHandleKind.EMAIL
              ? workspaceMembers.find(
                  (workspaceMember) =>
                    workspaceMember.userEmail === participant.handle,
                )
              : undefined;

          const shouldMatchWithPerson =
            matchWith === 'workspaceMemberAndPerson' ||
            matchWith === 'personOnly';

          const shouldMatchWithWorkspaceMember =
            matchWith === 'workspaceMemberAndPerson' ||
            matchWith === 'workspaceMemberOnly';

          const newParticipant = {
            ...participant,
            ...(shouldMatchWithPerson && {
              personId: matchedPersonId,
            }),
            ...(shouldMatchWithWorkspaceMember && {
              workspaceMemberId: isDefined(workspaceMember)
                ? workspaceMember.id
                : null,
            }),
          };

          if (
            newParticipant.personId === participant.personId &&
            newParticipant.workspaceMemberId === participant.workspaceMemberId
          ) {
            return null;
          }

          return newParticipant;
        })
        .filter(isDefined);

      await participantRepository.updateMany(
        partipantsToBeUpdated.map((participant) => ({
          criteria: participant.id,
          partialEntity: {
            personId: participant.personId,
            workspaceMemberId: participant.workspaceMemberId,
          },
        })),
      );

      this.workspaceEventEmitter.emitCustomBatchEvent(
        `${objectMetadataName}_matched`,
        [
          {
            workspaceMemberId: null,
            participants: partipantsToBeUpdated,
          },
        ],
        workspaceId,
      );
    }
  }

  public async matchParticipantsForWorkspaceMembers({
    participantMatching,
    objectMetadataName,
    workspaceId,
  }: MatchParticipantsForWorkspaceMembersArgs) {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const participantRepository = await this.getParticipantRepository({
        workspaceId,
        objectMetadataName,
      });

      const participants = await participantRepository.find({
        where: {
          workspaceMemberId: In(participantMatching.workspaceMemberIds),
        },
      });

      const tobeRematchedParticipants = participants.map((participant) => {
        return {
          ...participant,
          workspaceMemberId: null,
        };
      });

      await this.matchParticipants({
        matchWith: 'workspaceMemberOnly',
        participants: tobeRematchedParticipants as ParticipantWorkspaceEntity[],
        objectMetadataName,
        workspaceId,
      });
    }, authContext);
  }

  public async matchParticipantsForPeople({
    participantMatching,
    objectMetadataName,
    workspaceId,
  }: MatchParticipantsForPeopleArgs) {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const participantRepository = await this.getParticipantRepository({
        workspaceId,
        objectMetadataName,
      });

      let participantsMatchingPersonEmails: ParticipantWorkspaceEntity[] = [];
      let participantsMatchingPersonId: ParticipantWorkspaceEntity[] = [];
      let participantsMatchingPersonPhoneHandles: ParticipantWorkspaceEntity[] =
        [];
      let participantsMatchingExternalHandles: ParticipantWorkspaceEntity[] =
        [];

      if (participantMatching.personIds.length > 0) {
        participantsMatchingPersonId = (await participantRepository.find({
          where: {
            personId: In(participantMatching.personIds),
          },
        })) as ParticipantWorkspaceEntity[];
      }

      if (participantMatching.personEmails.length > 0) {
        participantsMatchingPersonEmails = (await participantRepository.find({
          where: {
            handle: In(participantMatching.personEmails),
          },
        })) as ParticipantWorkspaceEntity[];
      }

      const personPhoneHandles = participantMatching.personPhoneHandles ?? [];

      if (personPhoneHandles.length > 0) {
        participantsMatchingPersonPhoneHandles =
          (await participantRepository.find({
            where: {
              handle: In(personPhoneHandles),
            },
          })) as ParticipantWorkspaceEntity[];
      }

      const participantExternalHandles =
        participantMatching.participantExternalHandles ?? [];

      if (participantExternalHandles.length > 0) {
        participantsMatchingExternalHandles = (await participantRepository.find(
          {
            where: {
              handle: In(participantExternalHandles),
            },
          },
        )) as ParticipantWorkspaceEntity[];
      }

      const uniqueParticipants = [
        ...new Set([
          ...participantsMatchingPersonId,
          ...participantsMatchingPersonEmails,
          ...participantsMatchingPersonPhoneHandles,
          ...participantsMatchingExternalHandles,
        ]),
      ];

      const tobeRematchedParticipants = uniqueParticipants.map(
        (participant) => {
          // Opaque handles keep their current link so matchParticipants can skip
          // the write when the answer is unchanged. Forcing null there would
          // make every re-match write, and every write feeds the participant
          // listener that triggered this job.
          const shouldKeepCurrentPersonId =
            getParticipantHandleKind(participant) ===
            MessageHandleKind.EXTERNAL;

          return {
            ...participant,
            personId: shouldKeepCurrentPersonId ? participant.personId : null,
          };
        },
      );

      await this.matchParticipants({
        matchWith: 'personOnly',
        participants: tobeRematchedParticipants,
        objectMetadataName,
        workspaceId,
      });
    }, authContext);
  }
}
