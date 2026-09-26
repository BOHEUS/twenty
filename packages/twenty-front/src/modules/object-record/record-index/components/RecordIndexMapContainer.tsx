import { styled } from '@linaria/react';
import { Trans } from '@lingui/react/macro';
import { lazy, Suspense } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables, useThemeColorScheme } from 'twenty-ui/theme';

import { mapStyleUrlsState } from '@/client-config/states/mapStyleUrlsState';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { getRecordMapAddressFieldMetadataItem } from '@/object-record/record-map/utils/getRecordMapAddressFieldMetadataItem';

const RecordMap = lazy(() =>
  import('@/object-record/record-map/components/RecordMap').then((module) => ({
    default: module.RecordMap,
  })),
);

const StyledEmptyState = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  height: 100%;
  justify-content: center;
`;

export const RecordIndexMapContainer = () => {
  const {
    objectMetadataItem,
    viewBarInstanceId,
    labelIdentifierFieldMetadataItem,
  } = useRecordIndexContextOrThrow();
  const mapStyleUrls = useAtomStateValue(mapStyleUrlsState);
  const colorScheme = useThemeColorScheme();

  const addressFieldMetadataItem =
    getRecordMapAddressFieldMetadataItem(objectMetadataItem);

  if (!isDefined(mapStyleUrls)) {
    return (
      <StyledEmptyState>
        <Trans>The map view is disabled on this server.</Trans>
      </StyledEmptyState>
    );
  }

  if (!isDefined(addressFieldMetadataItem)) {
    return (
      <StyledEmptyState>
        <Trans>Add an address field to this object to use the map view.</Trans>
      </StyledEmptyState>
    );
  }

  return (
    <Suspense fallback={null}>
      <RecordMap
        objectMetadataItem={objectMetadataItem}
        viewBarInstanceId={viewBarInstanceId}
        addressFieldMetadataItem={addressFieldMetadataItem}
        labelIdentifierFieldMetadataItem={labelIdentifierFieldMetadataItem}
        styleUrl={mapStyleUrls[colorScheme]}
      />
    </Suspense>
  );
};
