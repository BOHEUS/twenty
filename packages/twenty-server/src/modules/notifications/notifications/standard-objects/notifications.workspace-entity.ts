import { registerEnumType } from '@nestjs/graphql';

import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import type { EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import type { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
import { type NotificationTargetWorkspaceEntity } from 'src/modules/notifications/notifications/standard-objects/notification-target.workspace-entity';

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
