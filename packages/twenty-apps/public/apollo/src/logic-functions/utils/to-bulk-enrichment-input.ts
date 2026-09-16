import { isObject } from '@sniptt/guards';
import { type RoutePayload } from 'twenty-sdk/define';

import { type BulkEnrichmentInput } from 'src/logic-functions/types/bulk-enrichment-input.type';

type BulkEnrichmentRouteBody = {
  recordIds?: string[];
  revealPersonalEmails?: boolean;
};

export type BulkEnrichmentFunctionInput =
  | BulkEnrichmentInput
  | RoutePayload<BulkEnrichmentRouteBody>;

const isRoutePayload = (
  input: BulkEnrichmentFunctionInput,
): input is RoutePayload<BulkEnrichmentRouteBody> =>
  isObject(input) && 'requestContext' in input;

export const toBulkEnrichmentInput = (
  input: BulkEnrichmentFunctionInput,
): BulkEnrichmentInput =>
  isRoutePayload(input)
    ? {
        records: input.body?.recordIds ?? [],
        revealPersonalEmails: input.body?.revealPersonalEmails,
      }
    : input;
