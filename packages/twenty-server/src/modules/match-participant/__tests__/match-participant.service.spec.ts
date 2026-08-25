import { Test, type TestingModule } from '@nestjs/testing';

import { MessageHandleKind, MessageParticipantRole } from 'twenty-shared/types';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';
import { MatchParticipantService } from 'src/modules/match-participant/match-participant.service';
import { type MessageParticipantWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

const WORKSPACE_ID = '20202020-0000-0000-0000-000000000001';

type QueryBuilderMock = Record<string, jest.Mock>;

const buildQueryBuilder = (people: unknown[]): QueryBuilderMock => {
  const queryBuilder: QueryBuilderMock = {
    getMany: jest.fn().mockResolvedValue(people),
  };

  for (const chainedMethod of [
    'where',
    'andWhere',
    'orWhere',
    'withDeleted',
    'orderBy',
  ]) {
    queryBuilder[chainedMethod] = jest.fn(() => queryBuilder);
  }

  return queryBuilder;
};

const buildParticipant = (
  overrides: Partial<MessageParticipantWorkspaceEntity>,
): MessageParticipantWorkspaceEntity =>
  ({
    id: 'participant-1',
    handle: 'telegram-1',
    handleKind: MessageHandleKind.EXTERNAL,
    displayName: 'Contact',
    role: MessageParticipantRole.FROM,
    messageId: 'message-1',
    personId: null,
    workspaceMemberId: null,
    ...overrides,
  }) as MessageParticipantWorkspaceEntity;

describe('MatchParticipantService', () => {
  let service: MatchParticipantService<MessageParticipantWorkspaceEntity>;
  let participantRepository: { find: jest.Mock; updateMany: jest.Mock };
  let peopleFoundByQuery: PersonWorkspaceEntity[];

  const runMatch = async (
    participants: MessageParticipantWorkspaceEntity[],
    matchHintsByHandle?: Map<string, { email?: string; phone?: string }>,
  ) =>
    service.matchParticipants({
      participants,
      objectMetadataName: 'messageParticipant',
      matchWith: 'personOnly',
      workspaceId: WORKSPACE_ID,
      matchHintsByHandle,
    });

  beforeEach(async () => {
    peopleFoundByQuery = [];
    participantRepository = {
      find: jest.fn().mockResolvedValue([]),
      updateMany: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchParticipantService,
        {
          provide: WorkspaceEventEmitter,
          useValue: { emitCustomBatchEvent: jest.fn() },
        },
        {
          provide: GlobalWorkspaceOrmManager,
          useValue: {
            getRepository: jest.fn(
              async (_workspaceId: string, objectName: string) => {
                if (objectName === 'person') {
                  return {
                    createQueryBuilder: () =>
                      buildQueryBuilder(peopleFoundByQuery),
                  };
                }

                if (objectName === 'workspaceMember') {
                  return { find: jest.fn().mockResolvedValue([]) };
                }

                return participantRepository;
              },
            ),
            executeInWorkspaceContext: jest.fn((callback) => callback()),
          },
        },
      ],
    }).compile();

    service = module.get(MatchParticipantService);
  });

  it('links an external participant to the person an earlier participant with the same handle knows', async () => {
    participantRepository.find.mockResolvedValue([
      { handle: 'telegram-1', personId: 'person-remembered' },
    ]);

    await runMatch([buildParticipant({})]);

    expect(participantRepository.updateMany).toHaveBeenCalledWith([
      {
        criteria: 'participant-1',
        partialEntity: {
          personId: 'person-remembered',
          workspaceMemberId: null,
        },
      },
    ]);
  });

  it('prefers a hinted email over handle memory', async () => {
    peopleFoundByQuery = [
      {
        id: 'person-from-hint',
        emails: { primaryEmail: 'contact@example.com' },
      } as PersonWorkspaceEntity,
    ];
    participantRepository.find.mockResolvedValue([
      { handle: 'telegram-1', personId: 'person-remembered' },
    ]);

    await runMatch(
      [buildParticipant({})],
      new Map([['telegram-1', { email: 'contact@example.com' }]]),
    );

    expect(participantRepository.updateMany).toHaveBeenCalledWith([
      expect.objectContaining({
        partialEntity: expect.objectContaining({
          personId: 'person-from-hint',
        }),
      }),
    ]);
  });

  it('falls back to handle memory when the hinted address matches nobody', async () => {
    participantRepository.find.mockResolvedValue([
      { handle: 'telegram-1', personId: 'person-remembered' },
    ]);

    await runMatch(
      [buildParticipant({})],
      new Map([['telegram-1', { email: 'nobody@example.com' }]]),
    );

    expect(participantRepository.updateMany).toHaveBeenCalledWith([
      expect.objectContaining({
        partialEntity: expect.objectContaining({
          personId: 'person-remembered',
        }),
      }),
    ]);
  });

  it('leaves an external participant unmatched when nothing knows the handle', async () => {
    await runMatch([buildParticipant({ personId: 'stale-person' })]);

    expect(participantRepository.updateMany).toHaveBeenCalledWith([
      expect.objectContaining({
        partialEntity: expect.objectContaining({ personId: null }),
      }),
    ]);
  });

  it('skips the write when handle memory confirms the link a participant already has', async () => {
    participantRepository.find
      .mockResolvedValueOnce([
        { id: 'participant-1', handle: 'telegram-1', personId: 'person-1' },
      ])
      .mockResolvedValueOnce([{ handle: 'telegram-1', personId: 'person-1' }]);

    await service.matchParticipantsForPeople({
      participantMatching: {
        personIds: [],
        personEmails: [],
        participantExternalHandles: ['telegram-1'],
      },
      objectMetadataName: 'messageParticipant',
      workspaceId: WORKSPACE_ID,
    });

    expect(participantRepository.updateMany).toHaveBeenCalledWith([]);
  });

  it('does not consult handle memory for email participants', async () => {
    await runMatch([
      buildParticipant({
        handle: 'contact@example.com',
        handleKind: MessageHandleKind.EMAIL,
      }),
    ]);

    expect(participantRepository.find).not.toHaveBeenCalled();
  });
});
