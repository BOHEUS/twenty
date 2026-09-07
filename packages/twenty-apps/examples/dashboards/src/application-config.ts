import { defineApplication } from 'twenty-sdk/define';

export const APPLICATION_UNIVERSAL_IDENTIFIER =
  '4b36609d-f553-4e10-b8ec-b0b747eb2ca5';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'Dashboards',
  description:
    'Two ways to ship a dashboard from an app: a standalone page in the nav, and a real dashboard record',
});
