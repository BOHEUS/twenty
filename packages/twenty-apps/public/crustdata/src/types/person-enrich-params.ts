// A profile URL reaches the full profile endpoint. A business email reaches contact enrichment and
// nothing else, so the two lookups are separate shapes rather than one with optional halves.
export type PersonEnrichParams =
  | { matchOn: 'profileUrl'; profileUrl: string; enrichContactData: boolean }
  | { matchOn: 'businessEmail'; businessEmail: string };
