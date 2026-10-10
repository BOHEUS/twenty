import { ExploriumError } from 'src/logic-functions/errors/explorium-error';

export class ExploriumOperationError extends ExploriumError {
  constructor(message: string) {
    super({ message, code: 'OPERATION_FAILED' });
  }
}
