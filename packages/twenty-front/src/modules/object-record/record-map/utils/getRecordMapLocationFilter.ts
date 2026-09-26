import { type RecordMapBounds } from '@/object-record/record-map/types/RecordMapBounds';
import { type RecordGqlOperationFilter } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

const FULL_LONGITUDE_SPAN = 360;

// MapLibre renders copies of the world side by side, so viewport longitudes
// can fall outside [-180, 180] while stored ones never do.
const wrapLongitude = (longitude: number) =>
  ((((longitude + 180) % FULL_LONGITUDE_SPAN) + FULL_LONGITUDE_SPAN) %
    FULL_LONGITUDE_SPAN) -
  180;

type GetRecordMapLocationFilterParams = {
  addressFieldName: string;
  bounds: RecordMapBounds | null;
};

export const getRecordMapLocationFilter = ({
  addressFieldName,
  bounds,
}: GetRecordMapLocationFilterParams): RecordGqlOperationFilter => {
  const hasLongitudeFilter = {
    [addressFieldName]: { addressLng: { is: 'NOT_NULL' } },
  };

  if (!isDefined(bounds)) {
    return {
      and: [
        { [addressFieldName]: { addressLat: { is: 'NOT_NULL' } } },
        hasLongitudeFilter,
      ],
    };
  }

  // The API accepts a single operator per field condition, so each range is
  // expressed as two conditions.
  const latitudeFilter: RecordGqlOperationFilter = {
    and: [
      { [addressFieldName]: { addressLat: { gte: bounds.south } } },
      { [addressFieldName]: { addressLat: { lte: bounds.north } } },
    ],
  };

  if (bounds.east - bounds.west >= FULL_LONGITUDE_SPAN) {
    return { and: [latitudeFilter, hasLongitudeFilter] };
  }

  const west = wrapLongitude(bounds.west);
  const east = wrapLongitude(bounds.east);

  const longitudeFilter: RecordGqlOperationFilter =
    west <= east
      ? {
          and: [
            { [addressFieldName]: { addressLng: { gte: west } } },
            { [addressFieldName]: { addressLng: { lte: east } } },
          ],
        }
      : {
          or: [
            { [addressFieldName]: { addressLng: { gte: west } } },
            { [addressFieldName]: { addressLng: { lte: east } } },
          ],
        };

  return { and: [latitudeFilter, longitudeFilter] };
};
