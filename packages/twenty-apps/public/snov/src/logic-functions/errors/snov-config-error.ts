import { SnovError } from 'src/logic-functions/errors/snov-error';

export class SnovConfigError extends SnovError {
  constructor(message: string) {
    super({ message, code: 'CONFIGURATION' });
  }
}
