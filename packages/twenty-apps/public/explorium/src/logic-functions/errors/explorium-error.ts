import { type ExploriumErrorCode } from 'src/logic-functions/errors/explorium-error-code';

export abstract class ExploriumError extends Error {
  readonly code: ExploriumErrorCode;

  constructor({
    message,
    code,
  }: {
    message: string;
    code: ExploriumErrorCode;
  }) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.code = code;
  }
}
