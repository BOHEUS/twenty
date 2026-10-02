import { buildStandardObjectSystemFields } from '@/metadata/utils/internal/build-standard-object-system-fields.util';

export const buildStandardObjectActorFields = (
  objectUniversalIdentifier: string,
) => {
  const { createdBy, updatedBy } = buildStandardObjectSystemFields(
    objectUniversalIdentifier,
  );
  return { createdBy, updatedBy };
};
