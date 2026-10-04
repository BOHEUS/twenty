import { PhoneLookupService } from 'src/engine/core-modules/telephony/services/phone-lookup.service';
import { type WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';

const buildService = (people: unknown[]) => {
  const getMany = jest.fn().mockResolvedValue(people);
  const queryBuilder = {
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getMany,
  };
  const personRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    save: jest.fn(),
    update: jest.fn(),
  };
  const workspaceOrmManager = {
    executeInWorkspaceContext: jest.fn((fn: () => Promise<unknown>) => fn()),
    getRepositoryWithContextPermissions: jest
      .fn()
      .mockReturnValue(personRepository),
  };

  return {
    service: new PhoneLookupService(
      workspaceOrmManager as unknown as WorkspaceOrmManager,
    ),
    workspaceOrmManager,
    personRepository,
    queryBuilder,
  };
};

describe('PhoneLookupService', () => {
  it('returns no candidates and no query for a number it cannot place', async () => {
    const { service, workspaceOrmManager } = buildService([]);

    await expect(
      service.lookupPeople({ phoneNumber: 'anonymous' }),
    ).resolves.toEqual({
      normalizedPhoneNumber: null,
      candidates: [],
      isTruncated: false,
    });
    expect(
      workspaceOrmManager.executeInWorkspaceContext,
    ).not.toHaveBeenCalled();
  });

  it('reads people through the context-permissioned repository and never writes', async () => {
    const { service, workspaceOrmManager, personRepository, queryBuilder } =
      buildService([
        {
          id: 'p1',
          phones: {
            primaryPhoneNumber: '612345678',
            primaryPhoneCallingCode: '+33',
            primaryPhoneCountryCode: 'FR',
            additionalPhones: null,
          },
        },
      ]);

    const result = await service.lookupPeople({
      phoneNumber: '+33 6 12 34 56 78',
    });

    expect(
      workspaceOrmManager.getRepositoryWithContextPermissions,
    ).toHaveBeenCalledWith('person');
    expect(queryBuilder.where).toHaveBeenCalledWith(
      expect.stringContaining('phonesPrimaryPhoneNumber'),
      expect.objectContaining({
        nationalNumber: '612345678',
        callingCodes: ['+33', '33'],
      }),
    );
    expect(queryBuilder.limit).toHaveBeenCalledWith(51);
    expect(personRepository.save).not.toHaveBeenCalled();
    expect(personRepository.update).not.toHaveBeenCalled();
    expect(result).toEqual({
      normalizedPhoneNumber: '+33612345678',
      candidates: [
        {
          personId: 'p1',
          matchBasis: 'PRIMARY_PHONE',
          matchedPhoneNumber: '+33612345678',
        },
      ],
      isTruncated: false,
    });
  });

  it('applies the default country to the input number, whatever its case', async () => {
    const { service } = buildService([]);

    const result = await service.lookupPeople({
      phoneNumber: '06 12 34 56 78',
      defaultCountryCode: 'fr',
    });

    expect(result.normalizedPhoneNumber).toBe('+33612345678');
  });

  it('flags truncation when more people share the number than the cap', async () => {
    const people = Array.from({ length: 51 }, (_, index) => ({
      id: `p${index}`,
      phones: {
        primaryPhoneNumber: '612345678',
        primaryPhoneCallingCode: '+33',
        primaryPhoneCountryCode: 'FR',
        additionalPhones: null,
      },
    }));
    const { service } = buildService(people);

    const result = await service.lookupPeople({ phoneNumber: '+33612345678' });

    expect(result.isTruncated).toBe(true);
    expect(result.candidates).toHaveLength(50);
  });
});
