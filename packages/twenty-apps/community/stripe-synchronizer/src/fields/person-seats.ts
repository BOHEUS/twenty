import { defineField, FieldType, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk';

export default defineField({
  universalIdentifier: '6c8c6169-3883-4bfa-b06f-7c9b037b596c',
  name: 'stripeSeats',
  label: 'Stripe seats',
  type: FieldType.NUMBER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  description: 'Number of seats from Stripe subscription',
  icon: 'IconMan',
});
