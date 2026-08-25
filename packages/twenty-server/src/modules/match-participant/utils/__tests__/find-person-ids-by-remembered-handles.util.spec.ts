import { MessageHandleKind } from 'twenty-shared/types';
import { In, IsNull, Not } from 'typeorm';

import { type WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { type MessageParticipantWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';
import { findPersonIdsByRememberedHandles } from 'src/modules/match-participant/utils/find-person-ids-by-remembered-handles.util';

const buildRepository = (participants: unknown[]) =>
  ({
    find: jest.fn().mockResolvedValue(participants),
  }) as unknown as WorkspaceRepository<MessageParticipantWorkspaceEntity> & {
    find: jest.Mock;
  };

describe('findPersonIdsByRememberedHandles', () => {
  it('returns an empty map without querying when no handles are given', async () => {
    const repository = buildRepository([]);

    const result = await findPersonIdsByRememberedHandles({
      participantRepository: repository,
      handles: [],
    });

    expect(result.size).toBe(0);
    expect(repository.find).not.toHaveBeenCalled();
  });

  it('only looks at external participants that already carry a person', async () => {
    const repository = buildRepository([]);

    await findPersonIdsByRememberedHandles({
      participantRepository: repository,
      handles: ['telegram-1'],
    });

    expect(repository.find).toHaveBeenCalledWith({
      where: {
        handle: In(['telegram-1']),
        handleKind: MessageHandleKind.EXTERNAL,
        personId: Not(IsNull()),
      },
      order: { createdAt: 'ASC' },
    });
  });

  it('maps each handle to the person the oldest participant was linked to', async () => {
    const repository = buildRepository([
      { handle: 'telegram-1', personId: 'person-1' },
      { handle: 'telegram-1', personId: 'person-2' },
      { handle: 'telegram-2', personId: 'person-3' },
    ]);

    const result = await findPersonIdsByRememberedHandles({
      participantRepository: repository,
      handles: ['telegram-1', 'telegram-2'],
    });

    expect(result.get('telegram-1')).toBe('person-1');
    expect(result.get('telegram-2')).toBe('person-3');
  });

  it('skips participants whose handle is empty', async () => {
    const repository = buildRepository([
      { handle: '', personId: 'person-1' },
      { handle: null, personId: 'person-2' },
    ]);

    const result = await findPersonIdsByRememberedHandles({
      participantRepository: repository,
      handles: ['telegram-1'],
    });

    expect(result.size).toBe(0);
  });
});
