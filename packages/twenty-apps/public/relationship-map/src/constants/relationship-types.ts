export type RelationshipTypeColor = 'blue' | 'orange' | 'green';

export type RelationshipTypeDefinition = {
  value: string;
  label: string;
  color: RelationshipTypeColor;
};

export const RELATIONSHIP_TYPES: RelationshipTypeDefinition[] = [
  { value: 'REPORTS_TO', label: 'Reports to', color: 'blue' },
  { value: 'INFLUENCES', label: 'Influences', color: 'orange' },
  { value: 'WORKS_WITH', label: 'Works with', color: 'green' },
];
