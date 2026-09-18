import { type UpdateFieldsOption } from 'src/logic-functions/types/update-fields-option';

export type RecordInput = string | { id?: string | null };

export type BulkEnrichInput = {
  records: RecordInput | RecordInput[];
  updateFields?: UpdateFieldsOption;
  minMatchScore?: number;
};
