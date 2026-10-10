import { SnovError } from 'src/logic-functions/errors/snov-error';

export class SnovOperationError extends SnovError {
  constructor(message: string) {
    super({ message, code: 'OPERATION_FAILED' });
  }
}
