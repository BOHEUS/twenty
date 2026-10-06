import { useEffect, useState } from 'react';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineFrontComponent } from 'twenty-sdk/define';

export const OWNER_STAGE_MATRIX_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER =
  '4a79da31-e205-447e-a690-c035c5627bdd';

const UNASSIGNED_KEY = 'unassigned';

type GroupByRow = {
  groupByDimensionValues: [string | null, string | null];
  totalCount: number;
};

type Matrix = {
  stages: string[];
  rows: {
    ownerKey: string;
    ownerName: string;
    countByStage: Map<string, number>;
  }[];
};

const buildMatrix = (
  groups: GroupByRow[],
  ownerNameById: Map<string, string>,
): Matrix => {
  const stages = new Set<string>();
  const rowByOwnerKey = new Map<string, Matrix['rows'][number]>();

  for (const group of groups) {
    const [ownerId, stage] = group.groupByDimensionValues;
    const stageKey = stage ?? 'NONE';
    const ownerKey = ownerId ?? UNASSIGNED_KEY;

    stages.add(stageKey);

    const row = rowByOwnerKey.get(ownerKey) ?? {
      ownerKey,
      ownerName: ownerId
        ? (ownerNameById.get(ownerId) ?? ownerId)
        : 'Unassigned',
      countByStage: new Map<string, number>(),
    };

    row.countByStage.set(stageKey, group.totalCount);
    rowByOwnerKey.set(ownerKey, row);
  }

  return { stages: [...stages], rows: [...rowByOwnerKey.values()] };
};

const cellStyle: React.CSSProperties = {
  borderBottom: '1px solid #ebebeb',
  padding: '6px 12px',
  textAlign: 'right',
};

const OwnerStageMatrix = () => {
  const [matrix, setMatrix] = useState<Matrix | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const client = new CoreApiClient();

      const [groupByResult, membersResult] = await Promise.all([
        client.query({
          opportunitiesGroupBy: {
            __args: { groupBy: [{ ownerId: true }, { stage: true }] },
            groupByDimensionValues: true,
            totalCount: true,
          },
        }),
        client.query({
          workspaceMembers: {
            edges: {
              node: { id: true, name: { firstName: true, lastName: true } },
            },
          },
        }),
      ]);

      const ownerNameById = new Map<string, string>(
        membersResult.workspaceMembers.edges.map(({ node }) => [
          node.id,
          `${node.name?.firstName ?? ''} ${node.name?.lastName ?? ''}`.trim(),
        ]),
      );

      setMatrix(
        buildMatrix(
          groupByResult.opportunitiesGroupBy as unknown as GroupByRow[],
          ownerNameById,
        ),
      );
    };

    load().catch((error: Error) => setErrorMessage(error.message));
  }, []);

  if (errorMessage !== null) {
    return <div style={{ padding: 16, color: '#c0392b' }}>{errorMessage}</div>;
  }

  if (matrix === null) {
    return <div style={{ padding: 16 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif', fontSize: 13 }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Owner</th>
            {matrix.stages.map((stage) => (
              <th key={stage} style={cellStyle}>
                {stage}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.map((row) => (
            <tr key={row.ownerKey}>
              <td style={{ ...cellStyle, textAlign: 'left' }}>
                {row.ownerName}
              </td>
              {matrix.stages.map((stage) => (
                <td key={stage} style={cellStyle}>
                  {row.countByStage.get(stage) ?? 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: OWNER_STAGE_MATRIX_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Opportunities by owner and stage',
  description: 'Opportunity counts grouped by workspace member and by stage',
  component: OwnerStageMatrix,
});
