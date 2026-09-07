import { defineApplicationRole } from 'twenty-sdk/define';

export const DEFAULT_FUNCTION_ROLE_UNIVERSAL_IDENTIFIER =
  '3cedeb4b-72d6-4723-b125-59dbf2511b22';

// The post-install and uninstall functions run as this role: they read page
// layout metadata and create/destroy the dashboard record.
export default defineApplicationRole({
  universalIdentifier: DEFAULT_FUNCTION_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Dashboards default function role',
  description: 'Role the Dashboards app operations run as',
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: true,
  canSoftDeleteAllObjectRecords: true,
  canDestroyAllObjectRecords: true,
});
