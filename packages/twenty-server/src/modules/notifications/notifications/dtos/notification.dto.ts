import { Field, ObjectType } from '@nestjs/graphql';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';

@ObjectType('Notification')
export class NotificationDto {
  @Field(() => UUIDScalarType)
  id: string;

  @Field()
  name: string;

  // fullPath either to notification from external service or Twenty record
  @Field()
  fullPath: string;

  // ???
  @Field()
  size: number;

  @Field()
  type: string;

  @Field(() => Date, { nullable: false })
  createdAt: Date;
}
