import { Field, ObjectType } from '@nestjs/graphql';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';

@ObjectType()
export class IngestMessageResult {
  @Field(() => String)
  externalId: string;

  @Field(() => UUIDScalarType)
  messageId: string;

  @Field(() => UUIDScalarType)
  messageThreadId: string;

  @Field(() => Boolean)
  created: boolean;
}

@ObjectType()
export class IngestMessagesOutput {
  @Field(() => [IngestMessageResult])
  results: IngestMessageResult[];
}
