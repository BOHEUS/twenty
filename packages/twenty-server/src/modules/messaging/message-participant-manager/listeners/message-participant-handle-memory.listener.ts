import { Injectable } from '@nestjs/common';

import { type ObjectRecordUpdateEvent } from 'twenty-shared/database-events';
import { MessageHandleKind } from 'twenty-shared/types';
import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'twenty-shared/utils';

import { OnDatabaseBatchEvent } from 'src/engine/api/graphql/graphql-query-runner/decorators/on-database-batch-event.decorator';
import { DatabaseEventAction } from 'src/engine/api/graphql/graphql-query-runner/enums/database-event-action';
import { objectRecordChangedProperties } from 'src/engine/core-modules/event-emitter/utils/object-record-changed-properties.util';
import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { WorkspaceEventBatch } from 'src/engine/workspace-event-emitter/types/workspace-event-batch.type';
import {
  MessageParticipantMatchParticipantJob,
  type MessageParticipantMatchParticipantJobData,
} from 'src/modules/messaging/message-participant-manager/jobs/message-participant-match-participant.job';
import { type MessageParticipantWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';

@Injectable()
export class MessageParticipantHandleMemoryListener {
  constructor(
    @InjectMessageQueue(MessageQueue.messagingQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {}

  // An opaque handle has no person field to match on, so linking one
  // participant by hand is the only thing that teaches the workspace who it is.
  // Every other participant carrying that handle has to be told. Only links
  // propagate: re-running this for an unlink would immediately relink from the
  // participants that still hold the person.
  @OnDatabaseBatchEvent('messageParticipant', DatabaseEventAction.UPDATED)
  async handleUpdatedEvent(
    payload: WorkspaceEventBatch<
      ObjectRecordUpdateEvent<MessageParticipantWorkspaceEntity>
    >,
  ) {
    const participantExternalHandles = [
      ...new Set(
        payload.events
          .filter(
            (eventPayload) =>
              eventPayload.properties.after.handleKind ===
                MessageHandleKind.EXTERNAL &&
              isDefined(eventPayload.properties.after.personId) &&
              objectRecordChangedProperties(
                eventPayload.properties.before,
                eventPayload.properties.after,
              ).includes('personId'),
          )
          .map((eventPayload) => eventPayload.properties.after.handle)
          .filter(isNonEmptyString),
      ),
    ];

    if (participantExternalHandles.length === 0) {
      return;
    }

    await this.messageQueueService.add<MessageParticipantMatchParticipantJobData>(
      MessageParticipantMatchParticipantJob.name,
      {
        workspaceId: payload.workspaceId,
        participantMatching: {
          personIds: [],
          personEmails: [],
          participantExternalHandles,
          workspaceMemberIds: [],
        },
      },
    );
  }
}
