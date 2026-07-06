import { Field, InputType } from '@nestjs/graphql';

import { IsArray, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateNotificationSettingsInput {
  @IsArray()
  @IsNotEmpty()
  @Field(() => [String])
  settings: string[];
}
