// Company enrich returns only `crustdata_company_id` and `basic_info` unless every other section is
// named explicitly. `technographics` and `social_posts` are left out: both are billed add-ons that
// need field-level access on the API key.
export const COMPANY_ENRICH_FIELDS = [
  'basic_info',
  'taxonomy',
  'locations',
  'headcount',
  'funding',
  'revenue',
  'hiring',
  'followers',
  'seo',
  'web_traffic',
  'competitors',
  'employee_reviews',
  'software_reviews',
  'people',
  'news',
  'social_profiles',
  'updated_at',
] as const;
