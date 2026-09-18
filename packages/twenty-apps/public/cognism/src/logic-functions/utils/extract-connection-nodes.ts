import { isArray, isNonEmptyString, isObject } from '@sniptt/guards';

// The core API always answers reads with a relay connection, but the shape is
// only known at runtime because queries are built from plain objects.
export const extractConnectionNodes = <TNode extends { id: string }>(
  connection: unknown,
): TNode[] => {
  if (!isObject(connection)) {
    return [];
  }

  const edges = (connection as { edges?: unknown }).edges;
  if (!isArray(edges)) {
    return [];
  }

  return edges
    .map((edge) => (isObject(edge) ? (edge as { node?: unknown }).node : edge))
    .filter(
      (node): node is TNode =>
        isObject(node) && isNonEmptyString((node as { id?: unknown }).id),
    );
};
