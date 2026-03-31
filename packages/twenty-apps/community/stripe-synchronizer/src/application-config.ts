import { defineApplication } from 'twenty-sdk';

export default defineApplication({
  universalIdentifier: '0ed2bcb8-64ab-4ca1-b875-eeabf41b5f95',
  displayName: 'Stripe synchronizer',
  description: 'Plugin synchronizing data from Stripe to Twenty',
  icon: 'IconMoneyBag',
  defaultRoleUniversalIdentifier: '35f714a7-854b-48d8-aa30-fe2473c9d5cf',
  applicationVariables: {
    STRIPE_API_KEY: {
      universalIdentifier: '807d67d6-f720-49c4-a93e-ef16cf4fe919',
      isSecret: true,
      description: 'Required to send request to Stripe',
    },
    STRIPE_WEBHOOK_SECRET: {
      universalIdentifier: 'df51f0df-7ccd-4f3c-9f39-6d230a8e93d9',
      isSecret: true,
      description: 'Required to verify webhook data from Stripe',
    },
  },
});
