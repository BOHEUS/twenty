import { Field, InputType } from '@nestjs/graphql';

import {
  IsISO31661Alpha2,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType('PhoneLookupInput')
export class PhoneLookupInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  // Validated here so an unknown country is an error, not a silent null.
  @Field(() => String, {
    nullable: true,
    description:
      'ISO 3166-1 alpha-2 country used for numbers stored or given without a calling code',
  })
  @IsOptional()
  @IsISO31661Alpha2()
  defaultCountryCode?: string;
}
