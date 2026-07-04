import { defineConnectionProvider } from 'twenty-sdk/define';

export const GOOGLE_TASKS_CONNECTION_PROVIDER_UNIVERSAL_IDENTIFIER =
  '0a1d8b35-3da6-470f-9128-5c7a58f975d2';

export default defineConnectionProvider({
  universalIdentifier: GOOGLE_TASKS_CONNECTION_PROVIDER_UNIVERSAL_IDENTIFIER,
  name: 'google-tasks',
  displayName: 'google-tasks',
  type: 'oauth',
  oauth: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revokeEndpoint: 'https://oauth2.googleapis.com/revoke',
    scopes: [
      'https://www.googleapis.com/auth/tasks',
      'https://www.googleapis.com/auth/tasks.readonly',
    ],
    clientIdVariable: 'GOOGLE_TASKS_CLIENT_ID',
    clientSecretVariable: 'GOOGLE_TASKS_CLIENT_SECRET',
    tokenRequestContentType: 'form-urlencoded',
    usePkce: true,
  },
});
