import { registerEnumType } from '@nestjs/graphql';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import type { EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import type { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
import type { TaskWorkspaceEntity } from 'src/modules/task/standard-objects/task.workspace-entity';
import type { NoteWorkspaceEntity } from 'src/modules/note/standard-objects/note.workspace-entity';
import type { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import type { CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import type { OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import type { DashboardWorkspaceEntity } from 'src/modules/dashboard/standard-objects/dashboard.workspace-entity';
import type { WorkflowWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow.workspace-entity';
import type { CustomWorkspaceEntity } from 'src/engine/twenty-orm/custom.workspace-entity';
import { type MessageChannelWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-channel.workspace-entity';
import { type ApplicationEntity } from 'src/engine/core-modules/application/application.entity';
import { type AgentEntity } from 'src/engine/metadata-modules/ai/ai-agent/entities/agent.entity';
import { ActorMetadata } from 'twenty-shared/types';
import {
  NotificationTargetWorkspaceEntity
} from 'src/modules/notifications/notifications/standard-objects/notification-target.workspace-entity';

export enum NotificationType {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

registerEnumType(NotificationType, {
  name: 'NotificationType',
});

export class NotificationsWorkspaceEntity extends BaseWorkspaceEntity {
  createdBy: ActorMetadata;
  body: string;
  status: NotificationType;
  recipient: EntityRelation<WorkspaceMemberWorkspaceEntity>;
  recipientId: string;
  author: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  authorId: string | null;
  notificationTargets: EntityRelation<NotificationTargetWorkspaceEntity[]>;
}
