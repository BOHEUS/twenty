import { type CognismErrorCode } from 'src/logic-functions/errors/cognism-error-code';

export abstract class CognismError extends Error {
  readonly code: CognismErrorCode;

  constructor({ message, code }: { message: string; code: CognismErrorCode }) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.code = code;
  }
}
