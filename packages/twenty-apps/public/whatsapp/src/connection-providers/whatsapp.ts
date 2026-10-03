import { defineConnectionProvider } from 'twenty-sdk/define';
import { WHATSAPP_CONNECTION_PROVIDER_UNIVERSAL_IDENTIFIER } from "src/constants/universal-identifiers";

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
