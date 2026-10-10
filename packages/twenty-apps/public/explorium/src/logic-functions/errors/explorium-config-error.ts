import { ExploriumError } from 'src/logic-functions/errors/explorium-error';

export class ExploriumConfigError extends ExploriumError {
  constructor(message: string) {
    super({ message, code: 'CONFIGURATION' });
  }
}
