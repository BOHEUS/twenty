import type { RoutePayload } from "twenty-sdk/define";

export type RecordInput = string | { id?: string | null };

export type BulkEnrichmentInput = {
  records?: RecordInput | RecordInput[] | null;
  revealPersonalEmails?: boolean;
};

export type BulkEnrichmentRouteBody = {
  recordIds?: string[];
  revealPersonalEmails?: boolean;
};

export type BulkEnrichmentFunctionInput =
  | BulkEnrichmentInput
  | RoutePayload<BulkEnrichmentRouteBody>;