export type LogicFunctionEvent<TBody = object> = {
  headers: Record<string, string | undefined>;
  queryStringParameters: Record<string, string | undefined>;
  pathParameters: Record<string, string | undefined>;
  body: TBody | null;
  rawBody?: string;
  isBase64Encoded: boolean;
  requestContext: {
    http: {
      method: string;
      path: string;
      // The URL the provider called, built from the configured public
      // origin rather than the proxied request. Providers that sign the
      // full URL (Twilio) cannot be verified without it.
      url?: string;
    };
  };
  // Populated for HTTP-route triggers with `isAuthRequired: true`. null
  // when the trigger fires without a user (cron, database events) or when
  // auth is disabled.
  userWorkspaceId: string | null;
};
