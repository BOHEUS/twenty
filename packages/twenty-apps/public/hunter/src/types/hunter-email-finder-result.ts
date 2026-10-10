export type HunterEmailFinderResult = {
  email?: string | null;
  score?: number | null;
  accept_all?: boolean | null;
  position?: string | null;
  linkedin_url?: string | null;
  phone_number?: string | null;
  company?: string | null;
  sources?: Record<string, unknown>[] | null;
  verification?: { date?: string | null; status?: string | null } | null;
};
