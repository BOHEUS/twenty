import { type UpdateFieldsOption } from 'src/logic-functions/types/update-fields-option';

export type SingleEnrichInput = {
  recordId?: string;
  updateFields?: UpdateFieldsOption;
  minMatchScore?: number;
};
