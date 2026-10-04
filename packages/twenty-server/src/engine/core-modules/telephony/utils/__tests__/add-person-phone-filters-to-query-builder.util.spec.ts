import { type WorkspaceSelectQueryBuilder } from 'src/engine/twenty-orm/query-builder/workspace-select-query-builder';
import { addPersonPhoneFiltersToQueryBuilder } from 'src/engine/core-modules/telephony/utils/add-person-phone-filters-to-query-builder.util';

describe('addPersonPhoneFiltersToQueryBuilder', () => {
  it('matches the stored national number and calling code exactly, plus additional phones by containment', () => {
    const where = jest.fn().mockReturnThis();
    const queryBuilder = { where } as unknown as WorkspaceSelectQueryBuilder;

    addPersonPhoneFiltersToQueryBuilder({
      queryBuilder,
      phoneNumber: { callingCode: '+33', nationalNumber: '612345678' },
    });

    expect(where).toHaveBeenCalledTimes(1);

    const [clause, parameters] = where.mock.calls[0];

    expect(clause).toContain(
      '"person"."phonesPrimaryPhoneNumber" = :nationalNumber',
    );
    expect(clause).toContain(
      '"person"."phonesPrimaryPhoneCallingCode" IN (:...callingCodes)',
    );
    expect(clause).toContain('"person"."phonesAdditionalPhones" @>');
    expect(clause).not.toMatch(/LIKE|regexp_replace/);
    expect(parameters).toEqual({
      nationalNumber: '612345678',
      callingCodes: ['+33', '33'],
      additionalPhoneWithPlus: '[{"number":"612345678","callingCode":"+33"}]',
      additionalPhoneWithoutPlus: '[{"number":"612345678","callingCode":"33"}]',
    });
  });

  it('normalizes a calling code given without its plus', () => {
    const where = jest.fn().mockReturnThis();
    const queryBuilder = { where } as unknown as WorkspaceSelectQueryBuilder;

    addPersonPhoneFiltersToQueryBuilder({
      queryBuilder,
      phoneNumber: { callingCode: '33', nationalNumber: '612345678' },
    });

    expect(where.mock.calls[0][1].callingCodes).toEqual(['+33', '33']);
  });
});
