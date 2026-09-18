// What a Lusha credit costs the instance operator, plus the margin that covers
// the spread between Lusha plans.
export const LUSHA_CREDIT_COST_DOLLARS = 0.25;

export const BILLING_MARGIN_MULTIPLIER = 1.2;

export const MICRO_CREDITS_PER_DOLLAR = 1_000_000;

// Shared by the manifest and the charge, which the server refuses when the
// name it carries is not declared.
export const ENRICHMENT_BILLABLE_OPERATION_NAME = 'lushaEnrichment';
