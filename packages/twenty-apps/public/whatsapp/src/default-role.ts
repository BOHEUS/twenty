import { defineApplicationRole, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS, SystemPermissionFlag } from 'twenty-sdk/define';

import {
  APP_DISPLAY_NAME,
  DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplicationRole({
  universalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  label: `${APP_DISPLAY_NAME} default function role`,
  description: `${APP_DISPLAY_NAME} default function role`,
  canReadAllObjectRecords: false,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  canUpdateAllSettings: false,
  canBeAssignedToUsers: false,
  canBeAssignedToAgents: false,
  canBeAssignedToApiKeys: false,
  canAccessAllTools: false,
  objectPermissions: [ // TODO: add for other objects like message?
    {
      objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
  ],
  fieldPermissions: [],
  permissionFlagUniversalIdentifiers: [SystemPermissionFlag.SEND_EMAIL_TOOL]
});
