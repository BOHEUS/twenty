import { getRecordMapLocationFilter } from '@/object-record/record-map/utils/getRecordMapLocationFilter';

const ADDRESS_FIELD_NAME = 'address';

const LATITUDE_FILTER = {
  and: [
    { address: { addressLat: { gte: 40 } } },
    { address: { addressLat: { lte: 50 } } },
  ],
};

describe('getRecordMapLocationFilter', () => {
  it('only requires coordinates when there are no bounds', () => {
    expect(
      getRecordMapLocationFilter({
        addressFieldName: ADDRESS_FIELD_NAME,
        bounds: null,
      }),
    ).toEqual({
      and: [
        { address: { addressLat: { is: 'NOT_NULL' } } },
        { address: { addressLng: { is: 'NOT_NULL' } } },
      ],
    });
  });

  it('filters on a single longitude range inside [-180, 180]', () => {
    expect(
      getRecordMapLocationFilter({
        addressFieldName: ADDRESS_FIELD_NAME,
        bounds: { north: 50, south: 40, east: 10, west: -5 },
      }),
    ).toEqual({
      and: [
        LATITUDE_FILTER,
        {
          and: [
            { address: { addressLng: { gte: -5 } } },
            { address: { addressLng: { lte: 10 } } },
          ],
        },
      ],
    });
  });

  it('splits the longitude range when the viewport crosses the antimeridian', () => {
    expect(
      getRecordMapLocationFilter({
        addressFieldName: ADDRESS_FIELD_NAME,
        bounds: { north: 50, south: 40, east: 190, west: 170 },
      }),
    ).toEqual({
      and: [
        LATITUDE_FILTER,
        {
          or: [
            { address: { addressLng: { gte: 170 } } },
            { address: { addressLng: { lte: -170 } } },
          ],
        },
      ],
    });
  });

  it('wraps a viewport on another copy of the world', () => {
    expect(
      getRecordMapLocationFilter({
        addressFieldName: ADDRESS_FIELD_NAME,
        bounds: { north: 50, south: 40, east: 420, west: 400 },
      }),
    ).toEqual({
      and: [
        LATITUDE_FILTER,
        {
          and: [
            { address: { addressLng: { gte: 40 } } },
            { address: { addressLng: { lte: 60 } } },
          ],
        },
      ],
    });
  });

  it('drops the longitude range when the viewport spans the whole world', () => {
    expect(
      getRecordMapLocationFilter({
        addressFieldName: ADDRESS_FIELD_NAME,
        bounds: { north: 50, south: 40, east: 250, west: -250 },
      }),
    ).toEqual({
      and: [LATITUDE_FILTER, { address: { addressLng: { is: 'NOT_NULL' } } }],
    });
  });
});
