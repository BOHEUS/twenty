import { type fullEnrichEnrichField } from './types';

export const fullEnrichRequirements = () => {
  const options: fullEnrichEnrichField[] = ['contact.work_emails'];
  if (process.env.FULL_ENRICH_DATA_REQUIREMENTS?.includes('personal_emails')) {
    options.push('contact.personal_emails');
  }
  if (process.env.FULL_ENRICH_DATA_REQUIREMENTS?.includes('phones')) {
    options.push('contact.phones');
  }
  return options;
};
