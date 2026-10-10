import { type SnovErrorCode } from 'src/logic-functions/errors/snov-error-code';

export abstract class SnovError extends Error {
  readonly code: SnovErrorCode;

  constructor({ message, code }: { message: string; code: SnovErrorCode }) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.code = code;
  }
}
