import { type AmplemarketErrorCode } from 'src/logic-functions/errors/amplemarket-error-code';

export abstract class AmplemarketError extends Error {
  readonly code: AmplemarketErrorCode;

  constructor({
    message,
    code,
  }: {
    message: string;
    code: AmplemarketErrorCode;
  }) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.code = code;
  }
}
