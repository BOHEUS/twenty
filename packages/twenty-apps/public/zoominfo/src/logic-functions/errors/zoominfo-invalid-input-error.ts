import { ZoomInfoError } from 'src/logic-functions/errors/zoominfo-error';

export class ZoomInfoInvalidInputError extends ZoomInfoError {
  constructor(message: string) {
    super({ message, code: 'INVALID_INPUT' });
  }
}
