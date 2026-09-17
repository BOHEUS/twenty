export type LushaApiResult<TData> =
  | { success: true; data: TData }
  | {
      success: false;
      error: string;
      // The API key, the account or its credits are the problem, so every
      // other request of the run would fail the same way.
      isAccountFailure: boolean;
    };
