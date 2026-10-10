import { HunterError } from 'src/logic-functions/errors/hunter-error';

export class HunterConfigError extends HunterError {
  constructor(message: string) {
    super({ message, code: 'CONFIGURATION' });
  }
}
