import { isNonEmptyString } from '@sniptt/guards';
import { MessageHandleKind } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { In, Not, IsNull } from 'typeorm';

import { type WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { type MessageParticipantWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';

// An opaque provider id matches no person field, so the only memory of who it
// belongs to is an earlier participant carrying the same handle that somebody
// (or contact creation) already linked. The oldest such link wins so the answer
// does not flip when two participants disagree.
export const findPersonIdsByRememberedHandles = async ({
  participantRepository,
  handles,
}: {
  participantRepository: WorkspaceRepository<MessageParticipantWorkspaceEntity>;
  handles: string[];
}): Promise<Map<string, string>> => {
  if (handles.length === 0) {
    return new Map();
  }

  const rememberedParticipants = await participantRepository.find({
    where: {
      handle: In(handles),
      handleKind: MessageHandleKind.EXTERNAL,
      personId: Not(IsNull()),
    },
    order: { createdAt: 'ASC' },
  });

  const personIdByHandle = new Map<string, string>();

  for (const participant of rememberedParticipants) {
    if (
      !isDefined(participant.personId) ||
      !isNonEmptyString(participant.handle) ||
      personIdByHandle.has(participant.handle)
    ) {
      continue;
    }

    personIdByHandle.set(participant.handle, participant.personId);
  }

  return personIdByHandle;
};
