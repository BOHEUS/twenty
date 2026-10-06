import { defineApplication } from 'twenty-sdk/define';
import { DEFAULT_ROLE_UNIVERSAL_IDENTIFIER } from './roles/default.role';

export default defineApplication({
  universalIdentifier: '1ce1b504-6ce8-4d5e-85d3-92d6fa0cab0d',
  displayName: 'Double Group By',
  description:
    'POC: opportunities grouped by workspace member and by stage in a front component',
  defaultRoleUniversalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
});
