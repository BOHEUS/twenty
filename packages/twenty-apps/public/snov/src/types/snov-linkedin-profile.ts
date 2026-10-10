export type SnovLinkedinPosition = {
  name?: string | null;
  title?: string | null;
  linkedin_url?: string | null;
  url?: string | null;
  industry?: string | null;
  country?: string | null;
  location?: string | null;
};

export type SnovLinkedinProfile = {
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  industry?: string | null;
  location?: string | null;
  country?: string | null;
  skills?: string[] | null;
  positions?: SnovLinkedinPosition[] | null;
};
