import { ZoomInfoError } from 'src/logic-functions/errors/zoominfo-error';

export class ZoomInfoOperationError extends ZoomInfoError {
  constructor(message: string) {
    super({ message, code: 'OPERATION_FAILED' });
  }
}
