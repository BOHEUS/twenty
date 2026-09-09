import { defineConnectionProvider } from 'twenty-sdk/define';

export const APOLLO_CONNECTION_CONNECTION_PROVIDER_UNIVERSAL_IDENTIFIER =
  '28acb807-7966-4654-affa-7d64cc6deb73';

export default defineConnectionProvider({
  universalIdentifier: APOLLO_CONNECTION_CONNECTION_PROVIDER_UNIVERSAL_IDENTIFIER,
  name: 'apollo-connection',
  displayName: 'apollo-connection',
  type: 'oauth',
  oauth: {
    authorizationEndpoint: 'https://app.apollo.io/#/oauth/authorize',
    tokenEndpoint: 'https://app.apollo.io/api/v1/oauth/token',
    scopes: [],
    clientIdVariable: 'APOLLO_CONNECTION_CLIENT_ID',
    clientSecretVariable: 'APOLLO_CONNECTION_CLIENT_SECRET',
  },
});
