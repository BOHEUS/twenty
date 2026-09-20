import { RocketReachError } from 'src/logic-functions/errors/rocketreach-error';
import { RocketReachErrorCode } from 'src/logic-functions/errors/rocketreach-error-code';

export class RocketReachConfigError extends RocketReachError {
  constructor(message: string) {
    super({ message, code: RocketReachErrorCode.CONFIGURATION });
  }
}
