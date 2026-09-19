import { type EnrichResult } from 'src/types/enrich-result';

const MESSAGE_BY_MATCH_STATUS: Record<string, string> = {
  OPT_OUT: 'ZoomInfo has this contact flagged as opted out.',
  NON_MATCH_BY_CONTACT_ACCURACY_MIN:
    'ZoomInfo matched a record below the requested accuracy score.',
  NON_MATCH_BY_REQUIRED_FIELDS:
    'ZoomInfo matched a record missing the required fields.',
};

export const buildNotFoundResult = ({
  recordId,
  matchStatus,
}: {
  recordId: string;
  matchStatus: string;
}): EnrichResult => ({
  success: true,
  recordId,
  status: 'NOT_FOUND',
  updatedFields: [],
  message: MESSAGE_BY_MATCH_STATUS[matchStatus] ?? 'ZoomInfo returned no match.',
});
