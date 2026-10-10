import { type AmplemarketCompany } from 'src/types/amplemarket-company';

export type AmplemarketPhoneNumber = {
  id?: string | null;
  number?: string | null;
  type?: string | null;
  source?: string | null;
  is_wrong_number?: boolean | null;
  is_dnc_listed?: boolean | null;
};

export type AmplemarketPerson = {
  id?: string | null;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone_numbers?: AmplemarketPhoneNumber[] | null;
  linkedin_url?: string | null;
  title?: string | null;
  headline?: string | null;
  about?: string | null;
  gender?: string | null;
  current_position_start_date?: string | null;
  current_position_description?: string | null;
  location?: string | null;
  location_details?: {
    city?: string | null;
    state?: string | null;
    country?: string | null;
    lat?: number | null;
    long?: number | null;
  } | null;
  experiences?: Record<string, unknown>[] | null;
  educations?: Record<string, unknown>[] | null;
  languages?: Record<string, unknown>[] | null;
  company?: AmplemarketCompany | null;
};
