export type RelationshipGraphScope = 'workspace' | 'company' | 'person';

// Optional fields match the generated client, which types every selected field as optional
export type GraphPerson = {
  id: string;
  name?: { firstName?: string | null; lastName?: string | null } | null;
  jobTitle?: string | null;
};

export type GraphRelationship = {
  id: string;
  relationshipType?: string | null;
  source?: GraphPerson | null;
  target?: GraphPerson | null;
};

export type GraphNode = {
  id: string;
  name: string;
  jobTitle: string;
  isFocused: boolean;
};

export type GraphEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: string | null;
};

export type RelationshipGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isTruncated: boolean;
};

export type GraphPosition = { x: number; y: number };
