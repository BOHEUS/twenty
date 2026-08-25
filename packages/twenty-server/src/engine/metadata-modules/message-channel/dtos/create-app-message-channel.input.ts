import { Field, InputType } from '@nestjs/graphql';

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import {
  MessageChannelContactAutoCreationPolicy,
  MessageChannelVisibility,
  MessageHandleKind,
} from 'twenty-shared/types';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';

@InputType('CreateAppMessageChannelInput')
export class CreateAppMessageChannelInput {
  @Field(() => UUIDScalarType)
  @IsUUID()
  @IsNotEmpty()
  connectedAccountId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  handle: string;

  @Field(() => MessageHandleKind, { nullable: true })
  @IsOptional()
  @IsEnum(MessageHandleKind)
  handleKind?: MessageHandleKind;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  displayName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  externalChannelId?: string;

  @Field(() => MessageChannelVisibility, { nullable: true })
  @IsOptional()
  @IsEnum(MessageChannelVisibility)
  visibility?: MessageChannelVisibility;

  @Field(() => MessageChannelContactAutoCreationPolicy, { nullable: true })
  @IsOptional()
  @IsEnum(MessageChannelContactAutoCreationPolicy)
  contactAutoCreationPolicy?: MessageChannelContactAutoCreationPolicy;
}
