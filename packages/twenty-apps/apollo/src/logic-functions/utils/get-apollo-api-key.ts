import { APOLLO_API_KEY_VARIABLE_KEY } from 'src/constants/universal-identifiers';
import { toText } from '../data/to-text';

export const getApolloApiKey = (): string | undefined =>
  toText(process.env[APOLLO_API_KEY_VARIABLE_KEY]);
