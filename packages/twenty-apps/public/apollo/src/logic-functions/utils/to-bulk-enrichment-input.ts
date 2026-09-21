import { isObject } from '@sniptt/guards';
import { type RoutePayload } from 'twenty-sdk/define';

import {
  type BulkEnrichmentFunctionInput,
  type BulkEnrichmentInput,
  type BulkEnrichmentRouteBody
} from 'src/logic-functions/types/bulk-enrichment-input.type';

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
