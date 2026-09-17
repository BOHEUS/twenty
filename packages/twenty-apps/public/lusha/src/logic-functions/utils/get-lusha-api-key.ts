import { LUSHA_API_KEY_VARIABLE_NAME } from 'src/constants/application-variable-names.constant';
import { toText } from 'src/logic-functions/data/to-text';

export const getLushaApiKey = (): string | undefined =>
  toText(process.env[LUSHA_API_KEY_VARIABLE_NAME]);
