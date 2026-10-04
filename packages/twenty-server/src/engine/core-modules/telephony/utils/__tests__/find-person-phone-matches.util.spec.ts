import { findPersonPhoneMatches } from 'src/engine/core-modules/telephony/utils/find-person-phone-matches.util';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

const buildPerson = (
  id: string,
  phones: Partial<PersonWorkspaceEntity['phones']>,
): Pick<PersonWorkspaceEntity, 'id' | 'phones'> => ({
  id,
  phones: {
    primaryPhoneNumber: '',
    primaryPhoneCountryCode:
      '' as PersonWorkspaceEntity['phones']['primaryPhoneCountryCode'],
    primaryPhoneCallingCode: '',
    additionalPhones: null,
    ...phones,
  },
});

describe('findPersonPhoneMatches', () => {
  const normalizedPhoneNumber = '+33612345678';

  it('matches a primary phone stored as national number plus calling code', () => {
    const people = [
      buildPerson('p1', {
        primaryPhoneNumber: '612345678',
        primaryPhoneCallingCode: '+33',
      }),
    ];

    expect(findPersonPhoneMatches({ people, normalizedPhoneNumber })).toEqual([
      {
        personId: 'p1',
        matchBasis: 'PRIMARY_PHONE',
        matchedPhoneNumber: '+33612345678',
      },
    ]);
  });

  it('matches a primary phone stored with a trunk prefix and spaces', () => {
    const people = [
      buildPerson('p1', {
        primaryPhoneNumber: '06 12 34 56 78',
        primaryPhoneCallingCode: '+33',
      }),
    ];

    expect(
      findPersonPhoneMatches({ people, normalizedPhoneNumber }),
    ).toHaveLength(1);
  });

  it('matches a primary phone stored with an extension', () => {
    const people = [
      buildPerson('p1', {
        primaryPhoneNumber: '06 12 34 56 78 ext. 12',
        primaryPhoneCallingCode: '+33',
      }),
    ];

    expect(
      findPersonPhoneMatches({ people, normalizedPhoneNumber }),
    ).toHaveLength(1);
  });

  it('matches an additional phone and reports the basis', () => {
    const people = [
      buildPerson('p1', {
        primaryPhoneNumber: '4155552671',
        primaryPhoneCallingCode: '+1',
        additionalPhones: [
          { number: '612345678', callingCode: '+33', countryCode: 'FR' },
        ],
      }),
    ];

    expect(findPersonPhoneMatches({ people, normalizedPhoneNumber })).toEqual([
      {
        personId: 'p1',
        matchBasis: 'ADDITIONAL_PHONE',
        matchedPhoneNumber: '+33612345678',
      },
    ]);
  });

  it('returns every person carrying the number, in input order', () => {
    const people = [
      buildPerson('older', {
        primaryPhoneNumber: '612345678',
        primaryPhoneCallingCode: '+33',
      }),
      buildPerson('newer', {
        primaryPhoneNumber: '+33612345678',
      }),
    ];

    expect(
      findPersonPhoneMatches({ people, normalizedPhoneNumber }).map(
        (candidate) => candidate.personId,
      ),
    ).toEqual(['older', 'newer']);
  });

  it('drops suffix-only collisions that normalize to another number', () => {
    const people = [
      buildPerson('other-country', {
        primaryPhoneNumber: '612345678',
        primaryPhoneCallingCode: '+44',
      }),
      buildPerson('longer', {
        primaryPhoneNumber: '+33 9 61 23 45 678',
      }),
    ];

    expect(findPersonPhoneMatches({ people, normalizedPhoneNumber })).toEqual(
      [],
    );
  });

  it('uses the default country for numbers stored without any code', () => {
    const people = [buildPerson('p1', { primaryPhoneNumber: '0612345678' })];

    expect(findPersonPhoneMatches({ people, normalizedPhoneNumber })).toEqual(
      [],
    );
    expect(
      findPersonPhoneMatches({
        people,
        normalizedPhoneNumber,
        defaultCountryCode: 'FR',
      }),
    ).toHaveLength(1);
  });

  it('tolerates missing or malformed phone data', () => {
    const people = [
      {
        id: 'no-phones',
        phones: undefined as unknown as PersonWorkspaceEntity['phones'],
      },
      buildPerson('bad-additional', {
        additionalPhones: [
          null as unknown as NonNullable<
            PersonWorkspaceEntity['phones']['additionalPhones']
          >[number],
        ],
      }),
    ];

    expect(findPersonPhoneMatches({ people, normalizedPhoneNumber })).toEqual(
      [],
    );
  });
});
