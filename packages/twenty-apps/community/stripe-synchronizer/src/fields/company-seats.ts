import { defineField, FieldType, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk';

export default defineField({
  universalIdentifier: '1bb42c73-0321-48db-9b0d-66ddf7722b41',
  name: 'stripe-seats',
  label: 'Stripe seats',
  type: FieldType.NUMBER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  description: 'Number of seats from Stripe subscription',
  icon: 'IconMan',
});
