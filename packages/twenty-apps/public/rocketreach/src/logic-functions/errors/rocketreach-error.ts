import { type RocketReachErrorCode } from 'src/logic-functions/errors/rocketreach-error-code';

export abstract class RocketReachError extends Error {
  readonly code: RocketReachErrorCode;

  constructor({
    message,
    code,
  }: {
    message: string;
    code: RocketReachErrorCode;
  }) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.code = code;
  }
}
