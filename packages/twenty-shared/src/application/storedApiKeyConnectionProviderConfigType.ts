// Resolved form of `ApiKeyConnectionProviderConfig` as stored in the
// `connectionProvider.apiKeyConfig` JSONB column — manifest defaults are
// filled at write time.
export type StoredApiKeyConnectionProviderField = {
  key: string;
  label: string;
  isSecret: boolean;
  isRequired: boolean;
  placeholder: string | null;
};

export type StoredApiKeyConnectionProviderConfig = {
  fields: StoredApiKeyConnectionProviderField[];
  tokenFieldKey: string;
  handleFieldKey: string | null;
};
