import { DropcontactError } from 'src/logic-functions/errors/dropcontact-error';

export class DropcontactConfigError extends DropcontactError {
  constructor(message: string) {
    super({ message, code: 'CONFIGURATION' });
  }
}
