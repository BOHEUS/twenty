import { describe, expect, it } from 'vitest';

import { matchSelectValue } from 'src/logic-functions/data/match-select-value.util';
import { COMPANY_TYPES, SENIORITIES } from 'src/logic-functions/types/twenty.types';

describe('matchSelectValue', () => {
  it('should map every documented company type onto a Twenty option', () => {
    const documentedCompanyTypes = [
      'Partnership',
      'Nonprofit',
      'Educational',
      'Privately Held',
      'Public Company',
      'Self-Owned',
      'Self-Employed',
      'Government Agency',
    ];

    for (const companyType of documentedCompanyTypes) {
      expect(matchSelectValue(companyType, COMPANY_TYPES)).toBeDefined();
    }
  });

  it('should map every documented seniority onto a Twenty option', () => {
    const documentedSeniorities = [
      'Owner',
      'Founder',
      'C-level',
      'Partner',
      'VP',
      'Head',
      'Director',
      'Manager',
      'Senior',
    ];

    for (const seniority of documentedSeniorities) {
      expect(matchSelectValue(seniority, SENIORITIES)).toBeDefined();
    }
  });

  it('should drop a value that is not a known option', () => {
    expect(matchSelectValue('Worker Cooperative', COMPANY_TYPES)).toBeUndefined();
    expect(matchSelectValue(undefined, SENIORITIES)).toBeUndefined();
  });
});
