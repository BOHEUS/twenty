import { Field, InputType } from '@nestjs/graphql';

import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';

@InputType()
export class UpdateObjectSearchableFieldsInput {
  @IsNotEmpty()
  @IsUUID()
  @Field(() => UUIDScalarType, {
    description: 'The id of the object whose searchable fields are updated',
  })
  objectMetadataId!: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @Field(() => [UUIDScalarType], {
    description: 'Field metadata ids to include in the search vector',
  })
  fieldMetadataIds!: string[];
}
