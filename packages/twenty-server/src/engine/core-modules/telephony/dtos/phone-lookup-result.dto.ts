import { Field, ObjectType } from '@nestjs/graphql';

import { PhoneLookupCandidateDTO } from 'src/engine/core-modules/telephony/dtos/phone-lookup-candidate.dto';

@ObjectType('PhoneLookupResult')
export class PhoneLookupResultDTO {
  @Field(() => String, {
    nullable: true,
    description: 'E.164 form of the input, null when it could not be placed',
  })
  normalizedPhoneNumber: string | null;

  @Field(() => [PhoneLookupCandidateDTO])
  candidates: PhoneLookupCandidateDTO[];

  @Field(() => Boolean, {
    description:
      'True when the candidate scan hit its cap, so matching people may be missing from candidates',
  })
  isTruncated: boolean;
}
