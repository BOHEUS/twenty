import { DROPCONTACT_FRENCH_REGISTRY_VARIABLE_NAME } from 'src/constants/application-variable-names';

export const readFrenchRegistrySetting = (): boolean =>
  process.env[DROPCONTACT_FRENCH_REGISTRY_VARIABLE_NAME]?.trim() !== 'false';
