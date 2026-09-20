import { isBoolean } from '@sniptt/guards';

import {
  REVEAL_HEALTHCARE_VARIABLE_NAME,
  REVEAL_PERSONAL_EMAIL_VARIABLE_NAME,
  REVEAL_PHONE_VARIABLE_NAME,
} from 'src/constants/server-variable-names';
import { parseBooleanVariable } from 'src/logic-functions/utils/parse-boolean-variable';
import { type RevealSettings } from 'src/types/reveal-settings';

// A lookup with no reveal flag returns nothing, so professional email and
// detailed enrichment are always on; the costlier reveals are opt-in.
export const resolveRevealSettings = ({
  revealPersonalEmail,
  revealPhone,
}: {
  revealPersonalEmail?: boolean;
  revealPhone?: boolean;
}): RevealSettings => ({
  professionalEmail: true,
  detailedPersonEnrichment: true,
  personalEmail: isBoolean(revealPersonalEmail)
    ? revealPersonalEmail
    : (parseBooleanVariable(process.env[REVEAL_PERSONAL_EMAIL_VARIABLE_NAME]) ??
      false),
  phone: isBoolean(revealPhone)
    ? revealPhone
    : (parseBooleanVariable(process.env[REVEAL_PHONE_VARIABLE_NAME]) ?? false),
  healthcareEnrichment:
    parseBooleanVariable(process.env[REVEAL_HEALTHCARE_VARIABLE_NAME]) ?? false,
});
