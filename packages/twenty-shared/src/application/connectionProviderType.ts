// Discriminator on `connectionProvider.type`. 'oauth' pairs with the
// `oauthConfig` column; 'apiKey' stores a key pasted at connect time as the
// connected account's access token and needs no sub-config.
export type ConnectionProviderType = 'oauth' | 'apiKey';
