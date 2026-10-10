import { AmplemarketError } from 'src/logic-functions/errors/amplemarket-error';

export class AmplemarketOperationError extends AmplemarketError {
  constructor(message: string) {
    super({ message, code: 'OPERATION_FAILED' });
  }
}
