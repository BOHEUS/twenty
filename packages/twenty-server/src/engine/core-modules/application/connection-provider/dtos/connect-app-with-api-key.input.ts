import { Field, ID, InputType } from '@nestjs/graphql';

import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import {
  CONNECTION_PROVIDER_SCOPES,
  type ConnectionProviderScope,
} from 'twenty-shared/application';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { ConnectionProviderScopeEnum } from 'src/engine/core-modules/application/connection-provider/dtos/application-connection-provider.dto';

@InputType('ConnectAppWithApiKeyInput')
export class ConnectAppWithApiKeyInput {
  @IsUUID()
  @Field(() => UUIDScalarType)
  applicationId: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  providerName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  @Field()
  apiKey: string;

  @IsOptional()
  @IsIn(CONNECTION_PROVIDER_SCOPES)
  @Field(() => ConnectionProviderScopeEnum, { nullable: true })
  scope?: ConnectionProviderScope;

  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  reconnectingConnectedAccountId?: string;
}
