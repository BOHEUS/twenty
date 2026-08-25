// One value the workspace has to type in to connect: a bot token, a base URL,
// a user id. `isSecret` decides whether it is encrypted and write-only.
export type ApiKeyConnectionProviderField = {
  key: string;
  label: string;
  isSecret?: boolean;
  isRequired?: boolean;
  placeholder?: string;
};

export type ApiKeyConnectionProviderConfig = {
  fields: ApiKeyConnectionProviderField[];
  // Key of the field whose value becomes `connectedAccount.accessToken`. Every
  // other field lands in `connectionParameters`.
  tokenFieldKey: string;
  // Key of the field that names the account (a bot @name, a server URL). The
  // connecting user's email stands in when it is absent.
  handleFieldKey?: string;
};
