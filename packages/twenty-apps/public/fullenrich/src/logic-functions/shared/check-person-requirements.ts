import { type twentyPerson } from './types';

export const checkPersonRequirements = (twentyPerson: twentyPerson) => {
  const FULL_ENRICH_REQUEST_CONSTRAINTS =
    process.env.FULL_ENRICH_REQUEST_CONSTRAINTS;

  const phones = FULL_ENRICH_REQUEST_CONSTRAINTS?.includes('person.phones')
    ? twentyPerson.phones.primaryPhoneNumber !== ''
    : true;
  const email = FULL_ENRICH_REQUEST_CONSTRAINTS?.includes('person.email')
    ? twentyPerson.emails.primaryEmail !== ''
    : true;
  const location = FULL_ENRICH_REQUEST_CONSTRAINTS?.includes('person.location')
    ? !!twentyPerson.location?.addressCity
    : true;
  const about = FULL_ENRICH_REQUEST_CONSTRAINTS?.includes('person.about')
    ? !!twentyPerson.about
    : true;
  const jobTitle = FULL_ENRICH_REQUEST_CONSTRAINTS?.includes('person.jobTitle')
    ? twentyPerson.jobTitle !== ''
    : true;
  return (
    twentyPerson.name.firstName !== '' &&
    twentyPerson.name.lastName !== '' &&
    twentyPerson.linkedinLink.primaryLinkUrl !== '' &&
    phones &&
    email &&
    location &&
    about &&
    jobTitle
  );
};
