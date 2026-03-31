import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk';

export default defineField({
  universalIdentifier: '82bae9e2-c456-437b-8968-540775715cc4',
  name: 'stripeStatus',
  label: 'Stripe status',
  type: FieldType.SELECT,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  description: 'Status of Stripe subscription',
  icon: 'IconStatusChange',
  options: [
    {
      id: '27d3a665-2d24-40ab-a438-68d6b26bbc8e',
      // @ts-expect-error
      color: 'iris',
      label: 'Incomplete',
      value: 'INCOMPLETE',
      position: 1,
    },
    {
      id: '429d1d2f-6ca2-493d-a9b9-e98e161fa09e',
      // @ts-expect-error
      color: 'sky',
      label: 'Incomplete (expired)',
      value: 'INCOMPLETE_EXPIRED',
      position: 2,
    },
    {
      id: '705c19c6-85ea-4549-83ef-0019e7ab8d86',
      // @ts-expect-error
      color: 'amber',
      label: 'Trialing',
      value: 'TRIALING',
      position: 3,
    },
    {
      id: '50ac914f-893a-4c06-92e1-96f33f219dfb',
      // @ts-expect-error
      color: 'green',
      label: 'Active',
      value: 'ACTIVE',
      position: 4,
    },
    {
      id: '28b82425-5666-4c22-a90e-1549a54dccb7',
      // @ts-expect-error
      color: 'orange',
      label: 'Past due',
      value: 'PAST_DUE',
      position: 5,
    },
    {
      id: 'ddd8d16c-0573-4d40-8077-da484473ea43',
      // @ts-expect-error
      color: 'brown',
      label: 'Canceled',
      value: 'CANCELED',
      position: 6,
    },
    {
      id: '1fba3707-4263-4728-8530-e28e06872538',
      // @ts-expect-error
      color: 'red',
      label: 'Unpaid',
      value: 'UNPAID',
      position: 7,
    },
    {
      id: '0ba0f539-d656-448f-b6fd-133a2b79c33c',
      // @ts-expect-error
      color: 'gray',
      label: 'Paused',
      value: 'PAUSED',
      position: 8,
    },
  ],
});
