import { CoreApiClient } from 'twenty-client-sdk/core';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { fetchRelationshipGraph } from 'src/front-components/utils/fetch-relationship-graph';

const requireId = (id: string | null | undefined, what: string): string => {
  if (!id) throw new Error(`${what} returned no id`);
  return id;
};

describe('relationship map', () => {
  const client = new CoreApiClient();
  const runId = Date.now();
  const personIds: string[] = [];
  const relationshipIds: string[] = [];
  let companyId: string;
  let managerId: string;
  let employeeId: string;
  let advisorId: string;

  const createPerson = async (firstName: string, personCompanyId?: string) => {
    const result = await client.mutation({
      createPerson: {
        __args: {
          data: {
            name: { firstName, lastName: `RelationshipMap-${runId}` },
            ...(personCompanyId ? { companyId: personCompanyId } : {}),
          },
        },
        id: true,
      },
    });
    const personId = requireId(result.createPerson?.id, 'createPerson');

    personIds.push(personId);

    return personId;
  };

  const createRelationship = async (
    sourceId: string,
    targetId: string,
    relationshipType: 'REPORTS_TO' | 'INFLUENCES',
  ) => {
    const result = await client.mutation({
      createRelationship: {
        __args: { data: { sourceId, targetId, relationshipType } },
        id: true,
      },
    });

    relationshipIds.push(
      requireId(result.createRelationship?.id, 'createRelationship'),
    );
  };

  beforeAll(async () => {
    const company = await client.mutation({
      createCompany: {
        __args: { data: { name: `RelationshipMap-${runId}` } },
        id: true,
      },
    });

    companyId = requireId(company.createCompany?.id, 'createCompany');
    managerId = await createPerson('Manager', companyId);
    employeeId = await createPerson('Employee', companyId);
    advisorId = await createPerson('Advisor');

    await createRelationship(employeeId, managerId, 'REPORTS_TO');
    await createRelationship(advisorId, managerId, 'INFLUENCES');
  });

  afterAll(async () => {
    for (const id of relationshipIds) {
      await client
        .mutation({ destroyRelationship: { __args: { id }, id: true } })
        .catch(() => {});
    }
    for (const id of personIds) {
      await client
        .mutation({ destroyPerson: { __args: { id }, id: true } })
        .catch(() => {});
    }
    await client
      .mutation({ destroyCompany: { __args: { id: companyId }, id: true } })
      .catch(() => {});
  });

  it('draws the power map of a company with its outside connections', async () => {
    const graph = await fetchRelationshipGraph({
      client,
      scope: 'company',
      recordId: companyId,
    });

    const focusedById = Object.fromEntries(
      graph.nodes.map(({ id, isFocused }) => [id, isFocused]),
    );

    expect(focusedById).toEqual({
      [managerId]: true,
      [employeeId]: true,
      [advisorId]: false,
    });
    expect(
      graph.edges.map(({ sourceId, targetId, relationshipType }) => ({
        sourceId,
        targetId,
        relationshipType,
      })),
    ).toEqual(
      expect.arrayContaining([
        { sourceId: employeeId, targetId: managerId, relationshipType: 'REPORTS_TO' },
        { sourceId: advisorId, targetId: managerId, relationshipType: 'INFLUENCES' },
      ]),
    );
    expect(graph.edges).toHaveLength(2);
    expect(graph.isTruncated).toBe(false);
  });

  it("draws a person's direct connections only", async () => {
    const graph = await fetchRelationshipGraph({
      client,
      scope: 'person',
      recordId: employeeId,
    });

    expect(graph.nodes.map(({ id }) => id).sort()).toEqual(
      [employeeId, managerId].sort(),
    );
    expect(graph.edges).toHaveLength(1);
  });

  it('lists related people through the junction fields on person', async () => {
    const result = await client.query({
      person: {
        __args: { filter: { id: { eq: managerId } } },
        incomingRelationships: {
          edges: { node: { source: { id: true } } },
        },
      },
    });

    const sourceIds = result.person?.incomingRelationships?.edges.map(
      (edge: { node: { source?: { id: string } | null } }) =>
        edge.node.source?.id,
    );

    expect(sourceIds?.sort()).toEqual([employeeId, advisorId].sort());
  });
});
