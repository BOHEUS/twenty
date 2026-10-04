import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { isDefined } from 'twenty-shared/utils';

import { type TwentyStandardAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/types/twenty-standard-all-flat-entity-maps.type';

export const CALL_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS: string[] = [
  STANDARD_OBJECTS.call.universalIdentifier,
  STANDARD_OBJECTS.callParticipant.universalIdentifier,
];

export type CallStandardUniversalIdentifiers = {
  objectMetadata: string[];
  fieldMetadata: string[];
  index: string[];
  searchFieldMetadata: string[];
  view: string[];
  viewFieldGroup: string[];
  viewField: string[];
  pageLayout: string[];
  pageLayoutTab: string[];
  pageLayoutWidget: string[];
};

export const collectCallStandardUniversalIdentifiers = ({
  standardAllFlatEntityMaps,
}: {
  standardAllFlatEntityMaps: TwentyStandardAllFlatEntityMaps;
}): CallStandardUniversalIdentifiers => {
  const objectUniversalIdentifiers = new Set(
    CALL_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  );

  // Inverse relation fields live on person, company, opportunity and workspaceMember
  const fieldMetadata = Object.values(
    standardAllFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier,
  )
    .filter(isDefined)
    .filter(
      (flatFieldMetadata) =>
        objectUniversalIdentifiers.has(
          flatFieldMetadata.objectMetadataUniversalIdentifier,
        ) ||
        (isDefined(
          flatFieldMetadata.relationTargetObjectMetadataUniversalIdentifier,
        ) &&
          objectUniversalIdentifiers.has(
            flatFieldMetadata.relationTargetObjectMetadataUniversalIdentifier,
          )),
    )
    .map((flatFieldMetadata) => flatFieldMetadata.universalIdentifier);

  const index = Object.values(
    standardAllFlatEntityMaps.flatIndexMaps.byUniversalIdentifier,
  )
    .filter(isDefined)
    .filter((flatIndexMetadata) =>
      objectUniversalIdentifiers.has(
        flatIndexMetadata.objectMetadataUniversalIdentifier,
      ),
    )
    .map((flatIndexMetadata) => flatIndexMetadata.universalIdentifier);

  const searchFieldMetadata = Object.values(
    standardAllFlatEntityMaps.flatSearchFieldMetadataMaps.byUniversalIdentifier,
  )
    .filter(isDefined)
    .filter((flatSearchFieldMetadata) =>
      objectUniversalIdentifiers.has(
        flatSearchFieldMetadata.objectMetadataUniversalIdentifier,
      ),
    )
    .map(
      (flatSearchFieldMetadata) => flatSearchFieldMetadata.universalIdentifier,
    );

  const flatViews = Object.values(
    standardAllFlatEntityMaps.flatViewMaps.byUniversalIdentifier,
  )
    .filter(isDefined)
    .filter(
      (flatView) =>
        isDefined(flatView.objectMetadataUniversalIdentifier) &&
        objectUniversalIdentifiers.has(
          flatView.objectMetadataUniversalIdentifier,
        ),
    );
  const viewUniversalIdentifiers = new Set(
    flatViews.map((flatView) => flatView.universalIdentifier),
  );

  const viewFieldGroup = Object.values(
    standardAllFlatEntityMaps.flatViewFieldGroupMaps.byUniversalIdentifier,
  )
    .filter(isDefined)
    .filter((flatViewFieldGroup) =>
      viewUniversalIdentifiers.has(flatViewFieldGroup.viewUniversalIdentifier),
    )
    .map((flatViewFieldGroup) => flatViewFieldGroup.universalIdentifier);

  const viewField = Object.values(
    standardAllFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier,
  )
    .filter(isDefined)
    .filter((flatViewField) =>
      viewUniversalIdentifiers.has(flatViewField.viewUniversalIdentifier),
    )
    .map((flatViewField) => flatViewField.universalIdentifier);

  const flatPageLayouts = Object.values(
    standardAllFlatEntityMaps.flatPageLayoutMaps.byUniversalIdentifier,
  )
    .filter(isDefined)
    .filter(
      (flatPageLayout) =>
        isDefined(flatPageLayout.objectMetadataUniversalIdentifier) &&
        objectUniversalIdentifiers.has(
          flatPageLayout.objectMetadataUniversalIdentifier,
        ),
    );
  const pageLayoutUniversalIdentifiers = new Set(
    flatPageLayouts.map((flatPageLayout) => flatPageLayout.universalIdentifier),
  );

  const flatPageLayoutTabs = Object.values(
    standardAllFlatEntityMaps.flatPageLayoutTabMaps.byUniversalIdentifier,
  )
    .filter(isDefined)
    .filter((flatPageLayoutTab) =>
      pageLayoutUniversalIdentifiers.has(
        flatPageLayoutTab.pageLayoutUniversalIdentifier,
      ),
    );
  const pageLayoutTabUniversalIdentifiers = new Set(
    flatPageLayoutTabs.map(
      (flatPageLayoutTab) => flatPageLayoutTab.universalIdentifier,
    ),
  );

  const pageLayoutWidget = Object.values(
    standardAllFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier,
  )
    .filter(isDefined)
    .filter((flatPageLayoutWidget) =>
      pageLayoutTabUniversalIdentifiers.has(
        flatPageLayoutWidget.pageLayoutTabUniversalIdentifier,
      ),
    )
    .map((flatPageLayoutWidget) => flatPageLayoutWidget.universalIdentifier);

  return {
    objectMetadata: CALL_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
    fieldMetadata,
    index,
    searchFieldMetadata,
    view: flatViews.map((flatView) => flatView.universalIdentifier),
    viewFieldGroup,
    viewField,
    pageLayout: flatPageLayouts.map(
      (flatPageLayout) => flatPageLayout.universalIdentifier,
    ),
    pageLayoutTab: flatPageLayoutTabs.map(
      (flatPageLayoutTab) => flatPageLayoutTab.universalIdentifier,
    ),
    pageLayoutWidget,
  };
};
