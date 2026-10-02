import { type ActorMetadata } from 'twenty-shared/types';

export abstract class BaseWorkspaceEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
}
