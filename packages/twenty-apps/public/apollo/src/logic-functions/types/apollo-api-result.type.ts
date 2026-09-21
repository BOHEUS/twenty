export type ApolloApiResult<TData> =
  | { success: true; data: TData }
  | { success: false; error: string; isAuthFailure: boolean };
