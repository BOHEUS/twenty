import {
  type GraphEdge,
  type GraphNode,
  type GraphPerson,
  type GraphRelationship,
  type RelationshipGraph,
} from 'src/front-components/types/relationship-graph.type';

const toGraphNode = (person: GraphPerson, isFocused: boolean): GraphNode => ({
  id: person.id,
  name: `${person.name?.firstName ?? ''} ${person.name?.lastName ?? ''}`.trim(),
  jobTitle: person.jobTitle ?? '',
  isFocused,
});

export const buildRelationshipGraph = ({
  focusedPeople,
  relationships,
  isTruncated,
}: {
  focusedPeople: GraphPerson[];
  relationships: GraphRelationship[];
  isTruncated: boolean;
}): RelationshipGraph => {
  const nodesById = new Map<string, GraphNode>(
    focusedPeople.map((person) => [person.id, toGraphNode(person, true)]),
  );
  const edges: GraphEdge[] = [];

  for (const relationship of relationships) {
    const { source, target } = relationship;

    // A relationship whose person was deleted comes back with a null side
    if (!source || !target || source.id === target.id) {
      continue;
    }

    for (const person of [source, target]) {
      if (!nodesById.has(person.id)) {
        nodesById.set(person.id, toGraphNode(person, false));
      }
    }

    edges.push({
      id: relationship.id,
      sourceId: source.id,
      targetId: target.id,
      relationshipType: relationship.relationshipType ?? null,
    });
  }

  return { nodes: [...nodesById.values()], edges, isTruncated };
};
