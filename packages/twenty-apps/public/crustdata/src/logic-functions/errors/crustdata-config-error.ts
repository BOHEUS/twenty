import { CrustdataError } from 'src/logic-functions/errors/crustdata-error';
import { CrustdataErrorCode } from 'src/logic-functions/errors/crustdata-error-code';

export class CrustdataConfigError extends CrustdataError {
  constructor(message: string) {
    super({ message, code: CrustdataErrorCode.CONFIGURATION });
  }
}
