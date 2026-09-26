import { describe, expect, it } from 'vitest';

import { type GraphPerson } from 'src/front-components/types/relationship-graph.type';
import { buildRelationshipGraph } from 'src/front-components/utils/build-relationship-graph';

const person = (id: string, firstName: string, jobTitle = ''): GraphPerson => ({
  id,
  name: { firstName, lastName: 'Doe' },
  jobTitle,
});

const ada = person('ada', 'Ada', 'CTO');
const bob = person('bob', 'Bob');
const cyd = person('cyd', 'Cyd');

describe('buildRelationshipGraph', () => {
  it('turns relationships into edges and their people into nodes', () => {
    const graph = buildRelationshipGraph({
      focusedPeople: [],
      relationships: [
        { id: 'r1', relationshipType: 'REPORTS_TO', source: bob, target: ada },
        { id: 'r2', relationshipType: null, source: cyd, target: ada },
      ],
      isTruncated: false,
    });

    expect(graph.nodes).toEqual([
      { id: 'bob', name: 'Bob Doe', jobTitle: '', isFocused: false },
      { id: 'ada', name: 'Ada Doe', jobTitle: 'CTO', isFocused: false },
      { id: 'cyd', name: 'Cyd Doe', jobTitle: '', isFocused: false },
    ]);
    expect(graph.edges).toEqual([
      { id: 'r1', sourceId: 'bob', targetId: 'ada', relationshipType: 'REPORTS_TO' },
      { id: 'r2', sourceId: 'cyd', targetId: 'ada', relationshipType: null },
    ]);
  });

  it('keeps focused people without relationships and marks them focused', () => {
    const graph = buildRelationshipGraph({
      focusedPeople: [ada, bob],
      relationships: [
        { id: 'r1', relationshipType: 'INFLUENCES', source: ada, target: cyd },
      ],
      isTruncated: true,
    });

    expect(
      graph.nodes.map(({ id, isFocused }) => ({ id, isFocused })),
    ).toEqual([
      { id: 'ada', isFocused: true },
      { id: 'bob', isFocused: true },
      { id: 'cyd', isFocused: false },
    ]);
    expect(graph.isTruncated).toBe(true);
  });

  it('skips relationships with a missing side or pointing to the same person', () => {
    const graph = buildRelationshipGraph({
      focusedPeople: [],
      relationships: [
        { id: 'r1', relationshipType: null, source: ada, target: null },
        { id: 'r2', relationshipType: null, source: bob, target: bob },
      ],
      isTruncated: false,
    });

    expect(graph).toEqual({ nodes: [], edges: [], isTruncated: false });
  });

  it('handles people with no name', () => {
    const graph = buildRelationshipGraph({
      focusedPeople: [{ id: 'anon', name: null, jobTitle: null }],
      relationships: [],
      isTruncated: false,
    });

    expect(graph.nodes).toEqual([
      { id: 'anon', name: '', jobTitle: '', isFocused: true },
    ]);
  });
});
