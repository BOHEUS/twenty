import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk';

export default defineField({
  universalIdentifier: '82bae9e2-c456-437b-8968-540775715cc4',
  name: 'stripe-status',
  label: 'Stripe status',
  type: FieldType.SELECT,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  description: 'Status of Stripe subscription',
  icon: 'IconStatusChange',
  options: [
    {
      color: 'iris',
      label: 'Incomplete',
      value: 'INCOMPLETE',
      position: 1,
    },
    {
      color: 'sky',
      label: 'Incomplete (expired)',
      value: 'INCOMPLETE_EXPIRED',
      position: 2,
    },
    {
      color: 'amber',
      label: 'Trialing',
      value: 'TRIALING',
      position: 3,
    },
    {
      color: 'green',
      label: 'Active',
      value: 'ACTIVE',
      position: 4,
    },
    {
      color: 'orange',
      label: 'Past due',
      value: 'PAST_DUE',
      position: 5,
    },
    {
      color: 'brown',
      label: 'Canceled',
      value: 'CANCELED',
      position: 6,
    },
    {
      color: 'red',
      label: 'Unpaid',
      value: 'UNPAID',
      position: 7,
    },
    {
      color: 'gray',
      label: 'Paused',
      value: 'PAUSED',
      position: 8,
    },
  ],
});
