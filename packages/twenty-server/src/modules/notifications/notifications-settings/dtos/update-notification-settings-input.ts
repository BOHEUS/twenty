import { Field, InputType } from '@nestjs/graphql';

import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';

@InputType()
export class UpdateNotificationSettingsInputUpdates {
  @IsArray()
  @Field(() => [String])
  operations: string[];
}

@InputType()
export class UpdateNotificationSettingsInput {
  @IsUUID()
  @IsNotEmpty()
  @Field(() => UUIDScalarType, {
    description: 'The id of the notification settings to update',
  })
  id: string;

  @Type(() => UpdateNotificationSettingsInputUpdates)
  @ValidateNested()
  @Field(() => UpdateNotificationSettingsInputUpdates, {
    description: 'The notification settings fields to update',
  })
  update: UpdateNotificationSettingsInputUpdates;
}
