import { SNOV_FIND_MISSING_EMAILS_VARIABLE_NAME } from 'src/constants/application-variable-names';

export const readFindMissingEmailsSetting = (): boolean =>
  process.env[SNOV_FIND_MISSING_EMAILS_VARIABLE_NAME]?.trim() !== 'false';
