import {type twentyCompany} from './types';

export const checkCompanyRequirements = (twentyCompany: twentyCompany) => {
  const FULL_ENRICH_REQUEST_CONSTRAINTS = process.env.FULL_ENRICH_REQUEST_CONSTRAINTS;
  const employees = FULL_ENRICH_REQUEST_CONSTRAINTS?.includes(
    'company.employees',
  )
    ? twentyCompany.employees !== null
    : true;
  const address = FULL_ENRICH_REQUEST_CONSTRAINTS?.includes('company.address')
    ? twentyCompany.address.addressStreet1 !== '' &&
      twentyCompany.address.addressStreet2 !== '' &&
      twentyCompany.address.addressState !== '' &&
      twentyCompany.address.addressCity !== '' &&
      twentyCompany.address.addressPostCode !== '' &&
      twentyCompany.address.addressCountry !== ''
    : true;
  return (
    twentyCompany.name !== '' &&
    twentyCompany.domainName.primaryLinkUrl !== '' &&
    employees &&
    address
  );
};
