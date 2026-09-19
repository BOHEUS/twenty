import { ZoomInfoError } from 'src/logic-functions/errors/zoominfo-error';

export class ZoomInfoConfigError extends ZoomInfoError {
  constructor(message: string) {
    super({ message, code: 'CONFIGURATION' });
  }
}
