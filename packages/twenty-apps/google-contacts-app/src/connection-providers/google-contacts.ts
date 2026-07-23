import { defineConnectionProvider } from 'twenty-sdk/define';

export const GOOGLE_CONTACTS_CONNECTION_PROVIDER_UNIVERSAL_IDENTIFIER =
  '314ce67e-8a58-4a49-8b78-03e92905ca96';

export default defineConnectionProvider({
  universalIdentifier: GOOGLE_CONTACTS_CONNECTION_PROVIDER_UNIVERSAL_IDENTIFIER,
  name: 'google-contacts',
  displayName: 'google-contacts',
  type: 'oauth',
  oauth: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revokeEndpoint: 'https://oauth2.googleapis.com/revoke',
    scopes: [
      'https://www.googleapis.com/auth/contacts',
      'https://www.googleapis.com/auth/contacts.readonly',
    ],
    clientIdVariable: 'GOOGLE_CONTACTS_CLIENT_ID',
    clientSecretVariable: 'GOOGLE_CONTACTS_CLIENT_SECRET',
  },
});
