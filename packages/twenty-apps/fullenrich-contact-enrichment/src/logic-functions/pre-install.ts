import { definePreInstallLogicFunction, type InstallLogicFunctionPayload } from 'twenty-sdk';

const handler = async (payload: InstallLogicFunctionPayload): Promise<void> => {
  console.log('Pre install logic function executed successfully!', payload.previousVersion);
};

export default definePreInstallLogicFunction({
  universalIdentifier: '78ffc8c9-4ec8-4755-9345-163cd62a96cc',
  name: 'pre-install',
  description: 'Runs before installation to prepare the application.',
  timeoutSeconds: 300,
  handler,
});
