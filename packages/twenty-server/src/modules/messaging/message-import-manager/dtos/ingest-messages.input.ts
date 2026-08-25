import { Field, InputType, registerEnumType } from '@nestjs/graphql';

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { FILES_FIELD_MAX_NUMBER_OF_VALUES } from 'twenty-shared/constants';
import { MessageHandleKind, MessageParticipantRole } from 'twenty-shared/types';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { INGEST_MESSAGES_BATCH_MAX_SIZE } from 'src/modules/messaging/message-import-manager/constants/ingest-messages-batch-max-size.constant';
import { MessageDirection } from 'src/modules/messaging/common/enums/message-direction.enum';

registerEnumType(MessageDirection, { name: 'MessageDirection' });
registerEnumType(MessageHandleKind, { name: 'MessageHandleKind' });
registerEnumType(MessageParticipantRole, { name: 'MessageParticipantRole' });

@InputType()
export class IngestMatchHintsInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;
}

@InputType()
export class IngestParticipantInput {
  @Field(() => MessageParticipantRole)
  @IsEnum(MessageParticipantRole)
  role: MessageParticipantRole;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  handle: string;

  @Field(() => MessageHandleKind, { nullable: true })
  @IsOptional()
  @IsEnum(MessageHandleKind)
  handleKind?: MessageHandleKind;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  displayName?: string;

  @Field(() => IngestMatchHintsInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => IngestMatchHintsInput)
  matchHints?: IngestMatchHintsInput;
}

@InputType()
export class IngestAttachmentInput {
  @Field(() => UUIDScalarType)
  @IsUUID()
  fileId: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  label: string;
}

@InputType()
export class IngestMessageInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  externalId: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  threadExternalId: string;

  @Field(() => MessageDirection)
  @IsEnum(MessageDirection)
  direction: MessageDirection;

  @Field(() => String)
  @IsString()
  text: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  subject?: string;

  @Field(() => Date)
  @IsDate()
  receivedAt: Date;

  @Field(() => [IngestParticipantInput])
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => IngestParticipantInput)
  participants: IngestParticipantInput[];

  @Field(() => [IngestAttachmentInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(FILES_FIELD_MAX_NUMBER_OF_VALUES)
  @ValidateNested({ each: true })
  @Type(() => IngestAttachmentInput)
  attachments?: IngestAttachmentInput[];
}

@InputType()
export class IngestMessagesInput {
  @Field(() => UUIDScalarType)
  @IsUUID()
  messageChannelId: string;

  @Field(() => [IngestMessageInput])
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(INGEST_MESSAGES_BATCH_MAX_SIZE)
  @ValidateNested({ each: true })
  @Type(() => IngestMessageInput)
  messages: IngestMessageInput[];
}
