import { AmplemarketError } from 'src/logic-functions/errors/amplemarket-error';

export class AmplemarketConfigError extends AmplemarketError {
  constructor(message: string) {
    super({ message, code: 'CONFIGURATION' });
  }
}
