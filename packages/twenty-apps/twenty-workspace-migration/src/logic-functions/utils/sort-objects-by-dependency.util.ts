import { ObjectType } from "src/logic-functions/types/find-objects-fields.type";
import { getManyToOneRelationTargets } from "src/logic-functions/utils/get-many-to-one-relation-targets.util";

// Orders objects so that, for every MANY_TO_ONE relation (morph targets included), the object it targets
// (if present in the input list) comes out earlier - relation targets must exist before
// a field or record pointing at them can be created. Relation targets not present in the
// input list (e.g. already-existing objects outside the set being ordered) are ignored:
// they impose no ordering constraint here. Circular dependencies are broken arbitrarily
// at whichever edge closes the loop, since a true cycle can't be fully satisfied up front.
export const sortObjectsByDependency = (objects: ObjectType[]): ObjectType[] => {
  const byNameSingular = new Map(
    objects.map((object) => [object.nameSingular, object]),
  );
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const order: ObjectType[] = [];

  const visit = (object: ObjectType) => {
    if (visited.has(object.universalIdentifier) || visiting.has(object.universalIdentifier)) {
      return;
    }
    visiting.add(object.universalIdentifier);

    for (const { targetNameSingular } of object.fieldsList.flatMap(getManyToOneRelationTargets)) {
      const target = byNameSingular.get(targetNameSingular);

      if (target !== undefined && target.universalIdentifier !== object.universalIdentifier) {
        visit(target);
      }
    }

    visiting.delete(object.universalIdentifier);
    visited.add(object.universalIdentifier);
    order.push(object);
  };

  for (const object of objects) {
    visit(object);
  }

  return order;
};
