import { findPersonByPrimaryOrAdditionalPhone } from 'src/modules/match-participant/utils/find-person-by-primary-or-additional-phone';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

const buildPerson = (
  id: string,
  phones: Partial<PersonWorkspaceEntity['phones']>,
): PersonWorkspaceEntity =>
  ({ id, phones }) as unknown as PersonWorkspaceEntity;

describe('findPersonByPrimaryOrAdditionalPhone', () => {
  const primaryMatch = buildPerson('primary', {
    primaryPhoneNumber: '780123456',
    primaryPhoneCallingCode: '+33',
  });

  const additionalMatch = buildPerson('additional', {
    primaryPhoneNumber: '600000000',
    primaryPhoneCallingCode: '+33',
    additionalPhones: [
      { number: '780123456', callingCode: '+33', countryCode: 'FR' },
    ],
  });

  it('matches on the primary phone', () => {
    expect(
      findPersonByPrimaryOrAdditionalPhone({
        people: [primaryMatch],
        phone: '+33780123456',
      }),
    ).toBe(primaryMatch);
  });

  it('matches a handle sent without the leading plus', () => {
    expect(
      findPersonByPrimaryOrAdditionalPhone({
        people: [primaryMatch],
        phone: '33780123456',
      }),
    ).toBe(primaryMatch);
  });

  it('falls back to additional phones', () => {
    expect(
      findPersonByPrimaryOrAdditionalPhone({
        people: [additionalMatch],
        phone: '+33780123456',
      }),
    ).toBe(additionalMatch);
  });

  it('prefers a primary match over an additional one', () => {
    expect(
      findPersonByPrimaryOrAdditionalPhone({
        people: [additionalMatch, primaryMatch],
        phone: '+33780123456',
      }),
    ).toBe(primaryMatch);
  });

  it('does not match the same national number under a different calling code', () => {
    expect(
      findPersonByPrimaryOrAdditionalPhone({
        people: [primaryMatch],
        phone: '+44780123456',
      }),
    ).toBeUndefined();
  });

  it('returns undefined for an unparseable handle', () => {
    expect(
      findPersonByPrimaryOrAdditionalPhone({
        people: [primaryMatch],
        phone: 'contact@example.com',
      }),
    ).toBeUndefined();
  });
});
