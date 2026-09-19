import { CrustdataError } from 'src/logic-functions/errors/crustdata-error';
import { CrustdataErrorCode } from 'src/logic-functions/errors/crustdata-error-code';

export class CrustdataRecordNotFoundError extends CrustdataError {
  readonly objectNameSingular: string;
  readonly recordId: string;

  constructor({
    objectNameSingular,
    recordId,
  }: {
    objectNameSingular: string;
    recordId: string;
  }) {
    super({
      message: `${objectNameSingular} ${recordId} not found`,
      code: CrustdataErrorCode.RECORD_NOT_FOUND,
    });
    this.objectNameSingular = objectNameSingular;
    this.recordId = recordId;
  }
}
