// Person enrich returns only `basic_profile` and `social_handles` unless every other section is
// named explicitly, so the app asks for the sections it maps.
export const PERSON_ENRICH_FIELDS = [
  'basic_profile',
  'social_handles',
  'professional_network',
  'experience',
  'education',
  'skills',
  'certifications',
  'honors',
  'dev_platform_profiles',
  'assessment',
  'updated_at',
] as const;
