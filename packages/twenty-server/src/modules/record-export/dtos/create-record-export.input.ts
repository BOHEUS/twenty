import { Field, InputType } from '@nestjs/graphql';

import { GraphQLJSON } from 'graphql-scalars';

@InputType()
export class CreateRecordExportInput {
  @Field()
  objectNameSingular: string;

  @Field(() => GraphQLJSON, { nullable: true })
  filter?: Record<string, any>;

  @Field(() => GraphQLJSON, { nullable: true })
  orderBy?: Record<string, any>;

  @Field(() => [String], { nullable: true })
  fieldNames?: string[];
}
