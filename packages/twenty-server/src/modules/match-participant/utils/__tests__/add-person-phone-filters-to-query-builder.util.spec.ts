import { type EachTestingContext } from 'twenty-shared/testing';
import { type SelectQueryBuilder } from 'typeorm';

import { addPersonPhoneFiltersToQueryBuilder } from 'src/modules/match-participant/utils/add-person-phone-filters-to-query-builder';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

type AddPersonPhoneFiltersToQueryBuilderTestCase = EachTestingContext<{
  phones: string[];
  description: string;
}>;

const testCases: AddPersonPhoneFiltersToQueryBuilderTestCase[] = [
  {
    title: 'single E.164 phone',
    context: {
      phones: ['+33780123456'],
      description: 'should split one phone into calling code and number',
    },
  },
  {
    title: 'phone without a leading plus',
    context: {
      phones: ['33780123456'],
      description: 'should parse a WhatsApp style wa_id',
    },
  },
  {
    title: 'multiple phones',
    context: {
      phones: ['+33780123456', '+12125550123'],
      description: 'should create unique parameter names for each phone',
    },
  },
  {
    title: 'unparseable phone among parseable ones',
    context: {
      phones: ['+33780123456', 'not-a-number'],
      description: 'should drop the handles it cannot parse',
    },
  },
  {
    title: 'only unparseable phones',
    context: {
      phones: ['not-a-number'],
      description: 'should match nothing rather than every person',
    },
  },
  {
    title: 'empty phones array',
    context: {
      phones: [],
      description: 'should match nothing rather than every person',
    },
  },
];

interface QueryBuilderCall {
  method: string;
  args: unknown[];
}

let queryBuilderCalls: QueryBuilderCall[] = [];

const mockQueryBuilder: Partial<SelectQueryBuilder<PersonWorkspaceEntity>> = {
  where: jest.fn().mockImplementation((...args) => {
    queryBuilderCalls.push({ method: 'where', args });

    return mockQueryBuilder;
  }),
  orWhere: jest.fn().mockImplementation((...args) => {
    queryBuilderCalls.push({ method: 'orWhere', args });

    return mockQueryBuilder;
  }),
  withDeleted: jest.fn().mockImplementation((...args) => {
    queryBuilderCalls.push({ method: 'withDeleted', args });

    return mockQueryBuilder;
  }),
};

describe('addPersonPhoneFiltersToQueryBuilder', () => {
  beforeEach(() => {
    queryBuilderCalls = [];
    jest.clearAllMocks();
  });

  it.each(testCases)('$title', ({ context: { phones, description } }) => {
    const result = addPersonPhoneFiltersToQueryBuilder({
      queryBuilder:
        mockQueryBuilder as SelectQueryBuilder<PersonWorkspaceEntity>,
      phones,
    });

    expect(queryBuilderCalls).toMatchSnapshot(
      `${description} - query builder calls`,
    );

    expect(result).toBe(mockQueryBuilder);
  });
});
