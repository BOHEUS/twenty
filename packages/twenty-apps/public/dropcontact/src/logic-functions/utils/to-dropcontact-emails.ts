import { isArray, isNonEmptyString } from '@sniptt/guards';

import { type DropcontactEmail } from 'src/types/dropcontact-person-data';
import { isRecord } from 'src/utils/is-record';

export const toDropcontactEmails = (rawEmails: unknown): DropcontactEmail[] =>
  isArray(rawEmails)
    ? rawEmails.filter(
        (rawEmail): rawEmail is DropcontactEmail =>
          isRecord(rawEmail) && isNonEmptyString(rawEmail.email),
      )
    : [];
