import { CognismError } from 'src/logic-functions/errors/cognism-error';
import { CognismErrorCode } from 'src/logic-functions/errors/cognism-error-code';

export class CognismConfigError extends CognismError {
  constructor(message: string) {
    super({ message, code: CognismErrorCode.CONFIGURATION });
  }
}
