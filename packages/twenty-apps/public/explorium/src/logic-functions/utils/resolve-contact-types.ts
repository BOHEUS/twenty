import { isArray, isNonEmptyString, isString } from '@sniptt/guards';

import { EXPLORIUM_CONTACT_DETAILS_VARIABLE_NAME } from 'src/constants/application-variable-names';
import { CONTACT_DETAIL_OPTIONS } from 'src/constants/contact-detail-options';
import { DEFAULT_CONTACT_DETAILS } from 'src/constants/default-contact-details';
import { type ExploriumContactType } from 'src/types/explorium-contact-type';
import { isDefined } from 'src/utils/is-defined';

const CONTACT_TYPES: ReadonlySet<string> = new Set(
  CONTACT_DETAIL_OPTIONS.map((option) => option.value),
);

const isContactType = (value: unknown): value is ExploriumContactType =>
  isString(value) && CONTACT_TYPES.has(value);

const parseContactDetails = (rawValue: string): unknown => {
  try {
    return JSON.parse(rawValue);
  } catch {
    return undefined;
  }
};

export const resolveContactTypes = (): ExploriumContactType[] => {
  const rawValue = process.env[EXPLORIUM_CONTACT_DETAILS_VARIABLE_NAME];

  if (!isDefined(rawValue)) {
    return DEFAULT_CONTACT_DETAILS;
  }

  // The platform serializes an emptied multi-select as '', which means no contact details
  if (!isNonEmptyString(rawValue.trim())) {
    return [];
  }

  const contactDetails = parseContactDetails(rawValue);

  return isArray(contactDetails)
    ? Array.from(new Set(contactDetails.filter(isContactType)))
    : DEFAULT_CONTACT_DETAILS;
};
