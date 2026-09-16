// Apollo returns a wide, frequently-extended payload; every value is read
// through the pick helpers instead of a hand-maintained interface so a shape
// change degrades to a missing field rather than a crash.
export type ApolloRecord = Record<string, unknown>;
