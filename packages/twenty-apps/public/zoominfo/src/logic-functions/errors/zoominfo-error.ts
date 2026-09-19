import { type ZoomInfoErrorCode } from 'src/logic-functions/errors/zoominfo-error-code';

export abstract class ZoomInfoError extends Error {
  readonly code: ZoomInfoErrorCode;

  constructor({
    message,
    code,
  }: {
    message: string;
    code: ZoomInfoErrorCode;
  }) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.code = code;
  }
}
