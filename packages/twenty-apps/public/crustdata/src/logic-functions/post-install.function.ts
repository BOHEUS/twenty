import { definePostInstallLogicFunction } from 'twenty-sdk/define';

import { CRUSTDATA_LOGIC_FUNCTION_CONSTANTS } from 'src/constants/universal-identifiers';
import { postInstallCore } from 'src/logic-functions/handlers/post-install';

export default definePostInstallLogicFunction({
  universalIdentifier:
    CRUSTDATA_LOGIC_FUNCTION_CONSTANTS.postInstall.universalIdentifier,
  name: 'post-install',
  description:
    'Seeds the Crustdata enrichment workflows for People and Companies.',
  timeoutSeconds: 30,
  handler: () => postInstallCore(),
  shouldRunSynchronously: true,
});
