import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { type PhoneLookupMatchBasis as SharedPhoneLookupMatchBasis } from 'twenty-shared/application';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';

// GraphQL needs a runtime enum; values mirror the shared string union.
export enum PhoneLookupMatchBasis {
  PRIMARY_PHONE = 'PRIMARY_PHONE',
  ADDITIONAL_PHONE = 'ADDITIONAL_PHONE',
}

registerEnumType(PhoneLookupMatchBasis, { name: 'PhoneLookupMatchBasis' });

@ObjectType('PhoneLookupCandidate')
export class PhoneLookupCandidateDTO {
  @Field(() => UUIDScalarType)
  personId: string;

  @Field(() => PhoneLookupMatchBasis)
  matchBasis: SharedPhoneLookupMatchBasis;

  @Field(() => String)
  matchedPhoneNumber: string;
}
