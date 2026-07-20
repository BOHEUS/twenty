import { ConnectedAccountDTO } from "src/engine/metadata-modules/connected-account/dtos/connected-account.dto";
import { Field, InputType, OmitType } from "@nestjs/graphql";

@InputType()
export class CreateWorkspaceConnectedAccountInput extends OmitType(
  ConnectedAccountDTO,
  [
    'id',
    'accessToken',
    'refreshToken',
    'createdAt',
    'updatedAt',
    'lastCredentialsRefreshedAt',
    'authFailedAt',
    'archivedAt',
    'lastSignedInAt',
    'connectionProviderId',
    'handleAliases'
  ] as const,
  InputType,
) {
  @Field(() => [String], {nullable: true})
  aliases: string[];
}