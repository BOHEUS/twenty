import { isEmptyAddress } from 'src/logic-functions/utils/is-empty-address';
import { isEmptyCurrency } from 'src/logic-functions/utils/is-empty-currency';
import { isEmptyLinks } from 'src/logic-functions/utils/is-empty-links';
import { isEmptyText } from 'src/logic-functions/utils/is-empty-text';

// A person's employer is filled without renaming it, so its name is left out
export const EMPLOYER_COMPANY_EMPTY_CHECKS = {
  domainName: isEmptyLinks,
  linkedinLink: isEmptyLinks,
  address: isEmptyAddress,
  annualRevenue: isEmptyCurrency,
};

export const COMPANY_EMPTY_CHECKS = {
  ...EMPLOYER_COMPANY_EMPTY_CHECKS,
  name: isEmptyText,
};
