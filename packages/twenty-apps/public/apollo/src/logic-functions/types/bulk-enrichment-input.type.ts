export type RecordInput = string | { id?: string | null };

export type BulkEnrichmentInput = {
  records?: RecordInput | RecordInput[] | null;
  revealPersonalEmails?: boolean;
};
