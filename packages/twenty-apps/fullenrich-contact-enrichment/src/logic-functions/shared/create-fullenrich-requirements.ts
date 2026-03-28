export const fullEnrichRequirements = () => {
  let options: string[] = ['contact.emails'];
  if (process.env.FULL_ENRICH_DATA_REQUIREMENTS?.includes('personal_emails')) {
    options.push('contact.personal_emails');
  }
  if (process.env.FULL_ENRICH_DATA_REQUIREMENTS?.includes('phones')) {
    options.push('contact.phones');
  }
  return options;
};
