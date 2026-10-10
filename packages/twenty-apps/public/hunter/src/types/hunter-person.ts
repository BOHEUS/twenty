export type HunterPerson = {
  id?: string | null;
  name?: {
    fullName?: string | null;
    givenName?: string | null;
    familyName?: string | null;
  } | null;
  email?: string | null;
  location?: string | null;
  timeZone?: string | null;
  geo?: {
    city?: string | null;
    state?: string | null;
    country?: string | null;
    lat?: number | null;
    lng?: number | null;
  } | null;
  bio?: string | null;
  site?: string | null;
  employment?: {
    domain?: string | null;
    name?: string | null;
    title?: string | null;
    role?: string | null;
    subRole?: string | null;
    seniority?: string | null;
  } | null;
  facebook?: { handle?: string | null } | null;
  github?: { handle?: string | null; followers?: number | null } | null;
  twitter?: { handle?: string | null; followers?: number | null } | null;
  linkedin?: { handle?: string | null } | null;
  emailProvider?: string | null;
  phone?: string | null;
};
