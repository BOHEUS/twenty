import { isNonEmptyString } from '@sniptt/guards';

import { DROPCONTACT_RECORD_ID_CUSTOM_FIELD } from 'src/constants/dropcontact-record-id-custom-field';
import { type DropcontactPersonData } from 'src/types/dropcontact-person-data';
import { isRecord } from 'src/utils/is-record';

export const readDropcontactRecordId = (
  contact: DropcontactPersonData,
): string | undefined => {
  const recordId = isRecord(contact.custom_fields)
    ? contact.custom_fields[DROPCONTACT_RECORD_ID_CUSTOM_FIELD]
    : undefined;

  return isNonEmptyString(recordId) ? recordId : undefined;
};
