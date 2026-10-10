import { findRequiredApplicationCycle } from 'src/engine/core-modules/application/application-dependency/utils/find-required-application-cycle.util';

const APP_A = 'app-a';
const APP_B = 'app-b';
const APP_C = 'app-c';

const requiring = (...universalIdentifiers: string[]) =>
  universalIdentifiers.map((universalIdentifier) => ({ universalIdentifier }));

describe('findRequiredApplicationCycle', () => {
  it('should return undefined when requirements do not lead back', () => {
    expect(
      findRequiredApplicationCycle({
        applicationUniversalIdentifier: APP_A,
        requiredApplications: requiring(APP_B),
        applications: [
          {
            universalIdentifier: APP_B,
            requiredApplications: requiring(APP_C),
          },
          { universalIdentifier: APP_C, requiredApplications: [] },
        ],
      }),
    ).toBeUndefined();
  });

  it('should find two applications requiring each other', () => {
    expect(
      findRequiredApplicationCycle({
        applicationUniversalIdentifier: APP_A,
        requiredApplications: requiring(APP_B),
        applications: [
          {
            universalIdentifier: APP_B,
            requiredApplications: requiring(APP_A),
          },
        ],
      }),
    ).toEqual([APP_A, APP_B, APP_A]);
  });

  it('should find a cycle through several applications', () => {
    expect(
      findRequiredApplicationCycle({
        applicationUniversalIdentifier: APP_A,
        requiredApplications: requiring(APP_B),
        applications: [
          {
            universalIdentifier: APP_B,
            requiredApplications: requiring(APP_C),
          },
          {
            universalIdentifier: APP_C,
            requiredApplications: requiring(APP_A),
          },
        ],
      }),
    ).toEqual([APP_A, APP_B, APP_C, APP_A]);
  });

  it('should use the requirements being applied instead of the stored ones', () => {
    expect(
      findRequiredApplicationCycle({
        applicationUniversalIdentifier: APP_A,
        requiredApplications: [],
        applications: [
          {
            universalIdentifier: APP_A,
            requiredApplications: requiring(APP_B),
          },
          {
            universalIdentifier: APP_B,
            requiredApplications: requiring(APP_A),
          },
        ],
      }),
    ).toBeUndefined();
  });

  it('should ignore a cycle between other applications', () => {
    expect(
      findRequiredApplicationCycle({
        applicationUniversalIdentifier: APP_A,
        requiredApplications: requiring(APP_B),
        applications: [
          {
            universalIdentifier: APP_B,
            requiredApplications: requiring(APP_C),
          },
          {
            universalIdentifier: APP_C,
            requiredApplications: requiring(APP_B),
          },
        ],
      }),
    ).toBeUndefined();
  });
});
