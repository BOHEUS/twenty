import { type CoreApiClient } from 'twenty-client-sdk/core';

import {
  type GraphPerson,
  type GraphRelationship,
  type RelationshipGraph,
  type RelationshipGraphScope,
} from 'src/front-components/types/relationship-graph.type';
import { buildRelationshipGraph } from 'src/front-components/utils/build-relationship-graph';

const PAGE_SIZE = 200;
// Beyond this a force layout is unreadable and slow to compute in the browser
const MAX_RELATIONSHIPS = 1000;

const PERSON_SELECTION = {
  id: true,
  name: { firstName: true, lastName: true },
  jobTitle: true,
};

type Connection<TNode> = {
  edges: { node: TNode }[];
  pageInfo: { hasNextPage?: boolean | null; endCursor?: string | null };
};

const fetchFocusedPeople = async (
  client: CoreApiClient,
  scope: RelationshipGraphScope,
  recordId: string,
): Promise<{ people: GraphPerson[]; isTruncated: boolean }> => {
  const filter =
    scope === 'company'
      ? { companyId: { eq: recordId } }
      : { id: { eq: recordId } };

  const result = await client.query({
    people: {
      __args: { filter, first: PAGE_SIZE },
      pageInfo: { hasNextPage: true, endCursor: true },
      edges: { node: PERSON_SELECTION },
    },
  });
  const people: Connection<GraphPerson> | undefined = result.people;

  return {
    people: people?.edges.map((edge) => edge.node) ?? [],
    isTruncated: people?.pageInfo.hasNextPage === true,
  };
};

const fetchRelationshipsPage = async (
  client: CoreApiClient,
  filter: object,
  after: string | null,
): Promise<Connection<GraphRelationship> | undefined> => {
  const result = await client.query({
    relationships: {
      __args: { filter, first: PAGE_SIZE, ...(after ? { after } : {}) },
      pageInfo: { hasNextPage: true, endCursor: true },
      edges: {
        node: {
          id: true,
          relationshipType: true,
          source: PERSON_SELECTION,
          target: PERSON_SELECTION,
        },
      },
    },
  });

  return result.relationships;
};

const fetchRelationships = async (
  client: CoreApiClient,
  filter: object,
): Promise<{ relationships: GraphRelationship[]; isTruncated: boolean }> => {
  const relationships: GraphRelationship[] = [];
  let after: string | null = null;

  while (relationships.length < MAX_RELATIONSHIPS) {
    const page = await fetchRelationshipsPage(client, filter, after);

    relationships.push(...(page?.edges.map((edge) => edge.node) ?? []));

    const endCursor = page?.pageInfo.endCursor;

    if (page?.pageInfo.hasNextPage !== true || !endCursor) {
      return { relationships, isTruncated: false };
    }

    after = endCursor;
  }

  return { relationships, isTruncated: true };
};

export const fetchRelationshipGraph = async ({
  client,
  scope,
  recordId,
}: {
  client: CoreApiClient;
  scope: RelationshipGraphScope;
  recordId: string | null;
}): Promise<RelationshipGraph> => {
  if (scope === 'workspace') {
    const { relationships, isTruncated } = await fetchRelationships(client, {});

    return buildRelationshipGraph({
      focusedPeople: [],
      relationships,
      isTruncated,
    });
  }

  if (recordId === null) {
    return { nodes: [], edges: [], isTruncated: false };
  }

  const focusedPeople = await fetchFocusedPeople(client, scope, recordId);
  const focusedPersonIds = focusedPeople.people.map((person) => person.id);

  const { relationships, isTruncated } =
    focusedPersonIds.length > 0
      ? await fetchRelationships(client, {
          or: [
            { sourceId: { in: focusedPersonIds } },
            { targetId: { in: focusedPersonIds } },
          ],
        })
      : { relationships: [], isTruncated: false };

  return buildRelationshipGraph({
    focusedPeople: focusedPeople.people,
    relationships,
    isTruncated: isTruncated || focusedPeople.isTruncated,
  });
};
