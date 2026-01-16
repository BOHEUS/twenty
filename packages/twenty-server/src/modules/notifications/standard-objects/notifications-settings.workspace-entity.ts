import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import {
  WorkspaceMemberWorkspaceEntity
} from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class NotificationsSettingsWorkspaceEntity extends BaseWorkspaceEntity {
  createdBy: EntityRelation<WorkspaceMemberWorkspaceEntity>;
  createdById: string;
  settings: string[];
}