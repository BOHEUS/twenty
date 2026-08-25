import { Field, InputType } from '@nestjs/graphql';

import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';

@InputType()
export class ApiKeyConnectionFieldValueInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  key: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  value: string;
}

@InputType()
export class ConnectApiKeyConnectionProviderInput {
  @Field(() => UUIDScalarType)
  @IsUUID()
  connectionProviderId: string;

  @Field(() => [ApiKeyConnectionFieldValueInput])
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ApiKeyConnectionFieldValueInput)
  fieldValues: ApiKeyConnectionFieldValueInput[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsIn(['user', 'workspace'])
  visibility?: 'user' | 'workspace';
}
