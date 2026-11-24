import { type ViewSortManifest } from 'twenty-shared/application';

import { type UniversalFlatViewSort } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-view-sort.type';

export const fromViewSortManifestToUniversalFlatViewSort = ({
  viewSortManifest,
  position,
  viewUniversalIdentifier,
  applicationUniversalIdentifier,
  now,
}: {
  viewSortManifest: ViewSortManifest;
  position: number;
  viewUniversalIdentifier: string;
  applicationUniversalIdentifier: string;
  now: string;
}): UniversalFlatViewSort => {
  return {
    universalIdentifier: viewSortManifest.universalIdentifier,
    applicationUniversalIdentifier,
    fieldMetadataUniversalIdentifier:
      viewSortManifest.fieldMetadataUniversalIdentifier,
    viewUniversalIdentifier,
    direction: viewSortManifest.direction,
    position,
    subFieldName: viewSortManifest.subFieldName ?? null,
    relationTargetFieldMetadataUniversalIdentifier:
      viewSortManifest.relationTargetFieldMetadataUniversalIdentifier ?? null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
};
