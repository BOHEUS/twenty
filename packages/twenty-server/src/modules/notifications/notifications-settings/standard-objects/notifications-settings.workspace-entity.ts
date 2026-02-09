import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { ActorMetadata } from 'twenty-shared/types';

export class NotificationsSettingsWorkspaceEntity extends BaseWorkspaceEntity {
  createdBy: ActorMetadata;
  settings: string[];
}
