export type DropcontactContactInput = {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company?: string;
  website?: string;
  linkedin?: string;
  job?: string;
  custom_fields: Record<string, string>;
};
