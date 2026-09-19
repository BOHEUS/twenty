import { ZoomInfoError } from 'src/logic-functions/errors/zoominfo-error';

export class ZoomInfoAuthenticationError extends ZoomInfoError {
  constructor(message: string) {
    super({ message, code: 'AUTHENTICATION' });
  }
}
