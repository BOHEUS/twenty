import { isObject } from '@sniptt/guards';
import { type RoutePayload } from 'twenty-sdk/logic-function';

import { type BulkEnrichmentInput } from 'src/logic-functions/types/bulk-enrichment-input.type';

type BulkEnrichmentRouteBody = { recordIds?: string[] };

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
  isRoutePayload(input) ? { records: input.body?.recordIds ?? [] } : input;
