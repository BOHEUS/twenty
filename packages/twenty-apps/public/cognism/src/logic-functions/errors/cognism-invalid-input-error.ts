import { CognismError } from 'src/logic-functions/errors/cognism-error';
import { CognismErrorCode } from 'src/logic-functions/errors/cognism-error-code';

export class CognismInvalidInputError extends CognismError {
  constructor(message: string) {
    super({ message, code: CognismErrorCode.INVALID_INPUT });
  }
}
