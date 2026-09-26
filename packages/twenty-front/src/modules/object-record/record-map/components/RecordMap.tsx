import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import {
  LngLatBounds,
  MapLibreMap,
  Marker,
  NavigationControl,
  setWorkerUrl,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme';

import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { getLabelIdentifierFieldValue } from '@/object-metadata/utils/getLabelIdentifierFieldValue';
import { useOpenRecordFromIndexView } from '@/object-record/record-index/hooks/useOpenRecordFromIndexView';
import { useRecordMapRecords } from '@/object-record/record-map/hooks/useRecordMapRecords';
import { useRecordMapViewFilter } from '@/object-record/record-map/hooks/useRecordMapViewFilter';
import { type RecordMapBounds } from '@/object-record/record-map/types/RecordMapBounds';
import { getRecordMapRecordLocations } from '@/object-record/record-map/utils/getRecordMapRecordLocations';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';

// MapLibre resolves its worker next to its own module, which no longer
// exists once Vite bundles it.
setWorkerUrl(maplibreWorkerUrl);

const StyledContainer = styled.div`
  height: 100%;
  position: relative;
  width: 100%;
`;

const StyledMap = styled.div`
  height: 100%;
  width: 100%;
`;

const StyledOverlay = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  left: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  position: absolute;
  top: ${themeCssVariables.spacing[2]};
`;

const markerCssClass = css`
  background: ${themeCssVariables.color.blue};
  border: 2px solid ${themeCssVariables.background.primary};
  border-radius: 50%;
  box-shadow: ${themeCssVariables.boxShadow.light};
  cursor: pointer;
  height: 12px;
  padding: 0;
  width: 12px;
`;

type RecordMapProps = {
  objectMetadataItem: EnrichedObjectMetadataItem;
  viewBarInstanceId: string;
  addressFieldMetadataItem: FieldMetadataItem;
  labelIdentifierFieldMetadataItem: FieldMetadataItem | undefined;
  styleUrl: string;
};

export const RecordMap = ({
  objectMetadataItem,
  viewBarInstanceId,
  addressFieldMetadataItem,
  labelIdentifierFieldMetadataItem,
  styleUrl,
}: RecordMapProps) => {
  const { t } = useLingui();
  const { openRecordFromIndexView } = useOpenRecordFromIndexView();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [bounds, setBounds] = useState<RecordMapBounds | null>(null);
  const [fittedViewFilterKey, setFittedViewFilterKey] = useState<string | null>(
    null,
  );
  const [hasStyleLoadFailed, setHasStyleLoadFailed] = useState(false);

  const viewFilter = useRecordMapViewFilter({
    objectMetadataItem,
    viewBarInstanceId,
  });
  const viewFilterKey = JSON.stringify(viewFilter);
  const isFittedToViewFilter = fittedViewFilterKey === viewFilterKey;

  const addressFieldName = addressFieldMetadataItem.name;

  // Until the map is fitted to the current filters, records are fetched
  // without bounds so matches outside the viewport can be brought into view.
  const handleRecordsLoaded = useCallback(
    (records: ObjectRecord[]) => {
      if (isFittedToViewFilter || !isDefined(map)) {
        return;
      }

      setFittedViewFilterKey(viewFilterKey);

      const recordLocations = getRecordMapRecordLocations(
        records,
        addressFieldName,
      );

      if (recordLocations.length === 0) {
        return;
      }

      const recordsBounds = new LngLatBounds();

      recordLocations.forEach(({ longitude, latitude }) =>
        recordsBounds.extend([longitude, latitude]),
      );

      map.fitBounds(recordsBounds, {
        padding: 48,
        maxZoom: 12,
        animate: false,
      });
    },
    [isFittedToViewFilter, map, viewFilterKey, addressFieldName],
  );

  const loadedRecords = useRecordMapRecords({
    objectNameSingular: objectMetadataItem.nameSingular,
    viewFilter,
    addressFieldMetadataItem,
    labelIdentifierFieldMetadataItem,
    bounds: isFittedToViewFilter ? bounds : null,
    onRecordsLoaded: handleRecordsLoaded,
  });

  useEffect(() => {
    if (!isDefined(mapContainerRef.current)) {
      return;
    }

    const createdMap = new MapLibreMap({
      container: mapContainerRef.current,
      center: [0, 20],
      zoom: 1,
    });

    createdMap.addControl(new NavigationControl(), 'top-right');

    createdMap.on('moveend', () => {
      const mapBounds = createdMap.getBounds();

      setBounds({
        north: mapBounds.getNorth(),
        south: mapBounds.getSouth(),
        east: mapBounds.getEast(),
        west: mapBounds.getWest(),
      });
    });

    createdMap.on('error', () => {
      if (!createdMap.isStyleLoaded()) {
        setHasStyleLoadFailed(true);
      }
    });

    setMap(createdMap);

    return () => {
      createdMap.remove();
      setMap(null);
    };
  }, []);

  useEffect(() => {
    map?.setStyle(styleUrl);
  }, [map, styleUrl]);

  const records = loadedRecords?.records;

  useEffect(() => {
    if (!isDefined(map) || !isDefined(records)) {
      return;
    }

    const markers = getRecordMapRecordLocations(records, addressFieldName).map(
      ({ record, longitude, latitude }) => {
        const recordLabel = getLabelIdentifierFieldValue(
          record,
          labelIdentifierFieldMetadataItem,
        );
        const markerElement = document.createElement('button');

        markerElement.type = 'button';
        markerElement.className = markerCssClass;
        markerElement.title = recordLabel;
        markerElement.setAttribute('aria-label', recordLabel);
        markerElement.addEventListener('click', (event) => {
          event.stopPropagation();
          openRecordFromIndexView({ recordId: record.id });
        });

        return new Marker({ element: markerElement })
          .setLngLat([longitude, latitude])
          .addTo(map);
      },
    );

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [
    map,
    records,
    addressFieldName,
    labelIdentifierFieldMetadataItem,
    openRecordFromIndexView,
  ]);

  const getOverlayText = () => {
    if (hasStyleLoadFailed) {
      return t`The map could not be loaded.`;
    }

    if (!isDefined(loadedRecords)) {
      return null;
    }

    const displayedCount = loadedRecords.records.length;
    const matchingCount = loadedRecords.totalCount;

    return matchingCount > displayedCount
      ? t`Showing ${displayedCount} of ${matchingCount} records, zoom in to see more`
      : plural(displayedCount, {
          one: '# record',
          other: '# records',
        });
  };

  const overlayText = getOverlayText();

  return (
    <StyledContainer>
      <StyledMap ref={mapContainerRef} />
      {isDefined(overlayText) && <StyledOverlay>{overlayText}</StyledOverlay>}
    </StyledContainer>
  );
};
