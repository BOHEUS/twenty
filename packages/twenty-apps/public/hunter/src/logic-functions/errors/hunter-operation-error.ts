import { HunterError } from 'src/logic-functions/errors/hunter-error';

export class HunterOperationError extends HunterError {
  constructor(message: string) {
    super({ message, code: 'OPERATION_FAILED' });
  }
}
