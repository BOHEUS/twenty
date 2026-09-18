import { isDefined } from 'twenty-sdk/utils';

import { LUSHA_API_KEY_VARIABLE_NAME } from 'src/constants/application-variable-names.constant';
import { LUSHA_DEFAULT_API_KEY_VARIABLE_NAME } from 'src/constants/server-variable-names.constant';
import { toText } from 'src/logic-functions/data/to-text';
import { type LushaApiKey } from 'src/logic-functions/types/lusha-api-key.type';

// A workspace that filled in its own key spends the credits of its own Lusha
// account, so the instance-wide key only covers the workspaces that did not.
export const getLushaApiKey = (): LushaApiKey | undefined => {
  const workspaceApiKey = toText(process.env[LUSHA_API_KEY_VARIABLE_NAME]);

  if (isDefined(workspaceApiKey)) {
    return { value: workspaceApiKey, isBillable: false };
  }

  const instanceApiKey = toText(
    process.env[LUSHA_DEFAULT_API_KEY_VARIABLE_NAME],
  );

  return isDefined(instanceApiKey)
    ? { value: instanceApiKey, isBillable: true }
    : undefined;
};
