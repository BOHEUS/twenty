import { defineConnectionProvider } from 'twenty-sdk/define';

export const WHATSAPP_CONNECTION_PROVIDER_UNIVERSAL_IDENTIFIER =
  '5bb90895-9137-4a98-9865-442245575b32';

export default defineConnectionProvider({
  universalIdentifier: WHATSAPP_CONNECTION_PROVIDER_UNIVERSAL_IDENTIFIER,
  name: 'whatsapp',
  displayName: 'whatsapp',
  type: 'oauth',
  oauth: {
    // Replace with the OAuth provider's endpoints.
    authorizationEndpoint: 'https://example.com/oauth/authorize',
    tokenEndpoint: 'https://example.com/oauth/access_token',
    scopes: [],
    // Names of serverVariables declared on this app's defineApplication.
    clientIdVariable: 'WHATSAPP_CLIENT_ID',
    clientSecretVariable: 'WHATSAPP_CLIENT_SECRET',
  },
});
