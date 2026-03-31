import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk';

export default defineField({
  universalIdentifier: '6290f8a0-17dc-4022-bb35-3aa606d5c826',
  name: 'stripeStatus',
  label: 'Stripe status',
  type: FieldType.SELECT,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  description: 'Status of Stripe subscription',
  icon: 'IconStatusChange',
  options: [
    {
      id: 'fd11e9d4-7442-4684-b42b-59c55c1fe0f5',
      // @ts-expect-error
      color: 'iris',
      label: 'Incomplete',
      value: 'INCOMPLETE',
      position: 1,
    },
    {
      id: '66d18f39-8cfc-4255-aeca-a2c5f5252f9b',
      // @ts-expect-error
      color: 'sky',
      label: 'Incomplete (expired)',
      value: 'INCOMPLETE_EXPIRED',
      position: 2,
    },
    {
      id: 'b05ccf32-dca5-4692-b76a-555896bbad8d',
      // @ts-expect-error
      color: 'amber',
      label: 'Trialing',
      value: 'TRIALING',
      position: 3,
    },
    {
      id: 'ff3a99ff-6e59-4e70-9e93-4bc973f6f8b0',
      // @ts-expect-error
      color: 'green',
      label: 'Active',
      value: 'ACTIVE',
      position: 4,
    },
    {
      id: '2e68223b-61cf-4f9e-b77c-bd82c4b0cc66',
      // @ts-expect-error
      color: 'orange',
      label: 'Past due',
      value: 'PAST_DUE',
      position: 5,
    },
    {
      id: '831f7318-475a-4057-a052-a0a0ed185487',
      // @ts-expect-error
      color: 'brown',
      label: 'Canceled',
      value: 'CANCELED',
      position: 6,
    },
    {
      id: '74095905-9f45-49f2-bbbb-300a9212fa46',
      // @ts-expect-error
      color: 'red',
      label: 'Unpaid',
      value: 'UNPAID',
      position: 7,
    },
    {
      id: '79b0bed1-65f4-4bcf-95f2-053f01de2f14',
      // @ts-expect-error
      color: 'gray',
      label: 'Paused',
      value: 'PAUSED',
      position: 8,
    },
  ],
});
