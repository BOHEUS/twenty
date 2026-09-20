import { LOOKUP_CREDIT_COSTS } from 'src/constants/lookup-credit-costs';
import { type RevealSettings } from 'src/types/reveal-settings';

export const countPersonLookupCredits = (
  revealSettings: RevealSettings,
): number =>
  (revealSettings.professionalEmail
    ? LOOKUP_CREDIT_COSTS.professionalEmail
    : 0) +
  (revealSettings.personalEmail ? LOOKUP_CREDIT_COSTS.personalEmail : 0) +
  (revealSettings.phone ? LOOKUP_CREDIT_COSTS.phone : 0) +
  (revealSettings.detailedPersonEnrichment
    ? LOOKUP_CREDIT_COSTS.detailedPersonEnrichment
    : 0) +
  (revealSettings.healthcareEnrichment
    ? LOOKUP_CREDIT_COSTS.healthcareEnrichment
    : 0);
