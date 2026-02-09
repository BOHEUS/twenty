import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

export class NotificationsSettingsWorkspaceEntity extends BaseWorkspaceEntity {
  createdBy: ActorMetadata;
  settings: string[];
}
