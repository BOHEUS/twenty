import { isBoolean, isObject } from '@sniptt/guards';
import { type RoutePayload } from 'twenty-sdk/define';

import { type BulkEnrichInput } from 'src/types/bulk-enrich-input';

type EnrichRouteBody = { recordIds?: string[]; enrichContactData?: boolean };

export type EnrichInput = BulkEnrichInput | RoutePayload<EnrichRouteBody>;

const isRoutePayload = (
  input: EnrichInput,
): input is RoutePayload<EnrichRouteBody> =>
  isObject(input) && 'requestContext' in input;

export const toBulkEnrichInput = (input: EnrichInput): BulkEnrichInput => {
  if (!isRoutePayload(input)) {
    return input;
  }

  return {
    records: input.body?.recordIds ?? [],
    enrichContactData: isBoolean(input.body?.enrichContactData)
      ? input.body.enrichContactData
      : undefined,
  };
};
