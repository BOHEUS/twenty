import { type PhonesMetadata } from 'twenty-shared/types';

import { buildPhoneHandleCandidates } from 'src/modules/match-participant/utils/build-phone-handle-candidates.util';

const phones = (value: Partial<PhonesMetadata>): PhonesMetadata =>
  value as PhonesMetadata;

describe('buildPhoneHandleCandidates', () => {
  it('returns both the plus-prefixed and bare forms of the primary phone', () => {
    expect(
      buildPhoneHandleCandidates(
        phones({
          primaryPhoneCallingCode: '+33',
          primaryPhoneNumber: '780123456',
        }),
      ),
    ).toEqual(['+33780123456', '33780123456']);
  });

  it('includes additional phones', () => {
    expect(
      buildPhoneHandleCandidates(
        phones({
          primaryPhoneCallingCode: '+33',
          primaryPhoneNumber: '780123456',
          additionalPhones: [
            { number: '600000000', callingCode: '+33', countryCode: 'FR' },
          ],
        }),
      ),
    ).toEqual(['+33780123456', '33780123456', '+33600000000', '33600000000']);
  });

  it('skips entries missing a calling code or a number', () => {
    expect(
      buildPhoneHandleCandidates(
        phones({
          primaryPhoneCallingCode: '',
          primaryPhoneNumber: '780123456',
          additionalPhones: [
            { number: '', callingCode: '+33', countryCode: 'FR' },
          ],
        }),
      ),
    ).toEqual([]);
  });

  it('returns nothing for a person with no phone', () => {
    expect(buildPhoneHandleCandidates(null)).toEqual([]);
    expect(buildPhoneHandleCandidates(undefined)).toEqual([]);
    expect(buildPhoneHandleCandidates(phones({}))).toEqual([]);
  });
});
