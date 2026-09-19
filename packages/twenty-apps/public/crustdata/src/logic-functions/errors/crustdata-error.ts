import { type CrustdataErrorCode } from 'src/logic-functions/errors/crustdata-error-code';

export abstract class CrustdataError extends Error {
  readonly code: CrustdataErrorCode;

  constructor({ message, code }: { message: string; code: CrustdataErrorCode }) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.code = code;
  }
}
