import { Field, InputType } from '@nestjs/graphql';

import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { NotificationType } from 'src/modules/notifications/notifications/standard-objects/notifications.workspace-entity';

@InputType()
export class UpdateNotificationInputUpdates {
  @IsNotEmpty()
  @Field(() => NotificationType)
  status: string;
}

@InputType()
export class UpdateNotificationInput {
  @IsUUID()
  @IsNotEmpty()
  @Field(() => UUIDScalarType, {
    description: 'The id of the notification to update',
  })
  id: string;

  @Type(() => UpdateNotificationInputUpdates)
  @ValidateNested()
  @Field(() => UpdateNotificationInputUpdates, {
    description: 'The notification fields to update',
  })
  update: UpdateNotificationInputUpdates;
}
