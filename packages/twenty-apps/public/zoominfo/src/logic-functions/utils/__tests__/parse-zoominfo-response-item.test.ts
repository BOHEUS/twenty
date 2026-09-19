import { describe, expect, it } from 'vitest';

import { parseZoomInfoResponseItem } from 'src/logic-functions/utils/parse-zoominfo-response-item';

describe('parseZoomInfoResponseItem', () => {
  it('merges the item id into the matched attributes', () => {
    const result = parseZoomInfoResponseItem({
      id: '344589814',
      type: 'Company',
      attributes: { name: 'ZoomInfo' },
      meta: { matchStatus: 'FULL_MATCH' },
    });

    expect(result).toEqual({
      outcome: 'matched',
      matchStatus: 'FULL_MATCH',
      data: { name: 'ZoomInfo', id: '344589814' },
    });
  });

  it('keeps partial matches', () => {
    const result = parseZoomInfoResponseItem({
      id: '1',
      attributes: { company: { name: 'ZoomInfo' } },
      meta: { matchStatus: 'COMPANY_ONLY_MATCH' },
    });

    expect(result.outcome).toBe('matched');
  });

  it('reports an opt-out as not found, keeping the status', () => {
    const result = parseZoomInfoResponseItem({
      id: '0',
      type: 'NoMatch',
      meta: { matchStatus: 'OPT_OUT' },
    });

    expect(result).toEqual({ outcome: 'not_found', matchStatus: 'OPT_OUT' });
  });

  it('treats a rejected request as an error rather than an absent record', () => {
    const result = parseZoomInfoResponseItem({
      id: '0',
      meta: { matchStatus: 'LIMIT_EXCEEDED' },
    });

    expect(result.outcome).toBe('error');
  });

  it('never writes the placeholder id of a no-match item', () => {
    const result = parseZoomInfoResponseItem<{ id?: string }>({
      id: '0',
      attributes: { name: 'Acme' },
      meta: { matchStatus: 'FULL_MATCH' },
    });

    expect(result).toEqual({
      outcome: 'matched',
      matchStatus: 'FULL_MATCH',
      data: { name: 'Acme' },
    });
  });
});
