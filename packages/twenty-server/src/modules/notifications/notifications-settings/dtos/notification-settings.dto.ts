import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('NotificationSettings')
export class NotificationSettingsDto {
  @Field(() => [String])
  settings: string[];
}
