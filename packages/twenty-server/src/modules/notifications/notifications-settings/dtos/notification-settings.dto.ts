import { Field, ObjectType } from '@nestjs/graphql';

import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';

@ObjectType('NotificationSettings')
export class NotificationSettingsDto {
  @IsUUID()
  @IsNotEmpty()
  @Field(() => UUIDScalarType)
  id: string;

  @IsArray()
  @Field(() => [String])
  settings: string[];
}
