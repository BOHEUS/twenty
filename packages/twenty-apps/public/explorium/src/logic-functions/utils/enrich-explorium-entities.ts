import { isNonEmptyString } from '@sniptt/guards';

import { postExplorium } from 'src/logic-functions/utils/post-explorium';
import { isDefined } from 'src/utils/is-defined';
import { isRecord } from 'src/utils/is-record';
import { pruneUndefined } from 'src/utils/prune-undefined';

type EnrichExploriumEntitiesResult =
  | { ok: true; dataById: Map<string, Record<string, unknown>> }
  | { ok: false; httpStatus: number; message: string };

const toRowData = (rowData: unknown): Record<string, unknown> | undefined => {
  const firstRowData = Array.isArray(rowData) ? rowData[0] : rowData;

  return isRecord(firstRowData) ? firstRowData : undefined;
};

export const enrichExploriumEntities = async ({
  path,
  idsKey,
  idKey,
  ids,
  parameters,
  resourceContext,
}: {
  path: string;
  idsKey: string;
  idKey: string;
  ids: string[];
  parameters?: Record<string, unknown>;
  resourceContext: string;
}): Promise<EnrichExploriumEntitiesResult> => {
  if (ids.length === 0) {
    return { ok: true, dataById: new Map() };
  }

  const response = await postExplorium({
    path,
    body: pruneUndefined({ [idsKey]: ids, parameters }),
    resourceContext,
  });

  if (!response.ok) {
    return response;
  }

  const dataById = new Map<string, Record<string, unknown>>();
  const rows = Array.isArray(response.json.data) ? response.json.data : [];

  for (const row of rows) {
    if (!isRecord(row)) {
      continue;
    }

    const rowId = row[idKey];
    const rowData = toRowData(row.data);

    if (
      isNonEmptyString(rowId) &&
      isDefined(rowData) &&
      Object.keys(rowData).length > 0
    ) {
      dataById.set(rowId, rowData);
    }
  }

  return { ok: true, dataById };
};
