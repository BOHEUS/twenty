import { type HunterErrorCode } from 'src/logic-functions/errors/hunter-error-code';

export abstract class HunterError extends Error {
  readonly code: HunterErrorCode;

  constructor({ message, code }: { message: string; code: HunterErrorCode }) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.code = code;
  }
}
