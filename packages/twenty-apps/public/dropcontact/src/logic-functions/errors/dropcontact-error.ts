import { type DropcontactErrorCode } from 'src/logic-functions/errors/dropcontact-error-code';

export abstract class DropcontactError extends Error {
  readonly code: DropcontactErrorCode;

  constructor({
    message,
    code,
  }: {
    message: string;
    code: DropcontactErrorCode;
  }) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.code = code;
  }
}
