import {type twentyCompany} from './types';

export const checkCompanyRequirements = (twentyCompany: twentyCompany) => {
  const FULL_ENRICH_REQUEST_CONSTRAINTS = process.env.FULL_ENRICH_REQUEST_CONSTRAINTS;
  const headcount = FULL_ENRICH_REQUEST_CONSTRAINTS?.includes(
    'company.headcount',
  )
    ? twentyCompany.headcount !== null
    : true;
  // Postal code is excluded: FullEnrich never returns one, so requiring it here
  // would leave this check permanently unsatisfiable
  const address = FULL_ENRICH_REQUEST_CONSTRAINTS?.includes('company.address')
    ? twentyCompany.address.addressStreet1 !== '' &&
      twentyCompany.address.addressStreet2 !== '' &&
      twentyCompany.address.addressState !== '' &&
      twentyCompany.address.addressCity !== '' &&
      twentyCompany.address.addressCountry !== ''
    : true;
  return (
    twentyCompany.name !== '' &&
    twentyCompany.domainName.primaryLinkUrl !== '' &&
    headcount &&
    address
  );
};
