export type ApolloApiResult<TData> =
  | { success: true; data: TData }
  // isAuthFailure marks a token Apollo rejected, which the caller reports back
  // to the platform so the connection shows as needing a reconnect.
  | { success: false; error: string; isAuthFailure: boolean };
