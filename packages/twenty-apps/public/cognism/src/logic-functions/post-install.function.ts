import { definePostInstallLogicFunction } from 'twenty-sdk/define';

import { COGNISM_LOGIC_FUNCTION_CONSTANTS } from 'src/constants/universal-identifiers';

const handler = async () => {
  return { seededWorkflows: [] };
};

export default definePostInstallLogicFunction({
  universalIdentifier:
    COGNISM_LOGIC_FUNCTION_CONSTANTS.postInstall.universalIdentifier,
  name: 'post-install',
  description:
    'Post-install hook for the Cognism app (workflow seeding is not currently wired up).',
  timeoutSeconds: 30,
  handler,
  shouldRunSynchronously: true,
});
