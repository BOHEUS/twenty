import { Field, InputType } from '@nestjs/graphql';

import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { NotificationType } from 'src/modules/notifications/notifications/standard-objects/notifications.workspace-entity';

@InputType()
export class UpdateBatchNotificationsInput {
  @IsUUID()
  @IsArray()
  @IsNotEmpty()
  @Field(() => [UUIDScalarType], {
    description: 'The ids of the notifications to update',
  })
  id: string[];

  @IsNotEmpty()
  @Field(() => NotificationType, {
    description: 'The status of notifications to update',
  })
  status: string;
}
