import { DropcontactError } from 'src/logic-functions/errors/dropcontact-error';

export class DropcontactOperationError extends DropcontactError {
  constructor(message: string) {
    super({ message, code: 'OPERATION_FAILED' });
  }
}
