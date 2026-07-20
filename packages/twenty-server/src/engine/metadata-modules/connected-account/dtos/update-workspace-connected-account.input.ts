import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateWorkspaceConnectedAccountInput {
  @Field(() => [String], {nullable: true})
  aliases: string[];
}