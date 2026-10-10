import { describe, expect, it } from 'vitest';

import { mapCompany } from 'src/logic-functions/utils/map-company';

describe('mapCompany', () => {
  it('maps the employer and French registry data', () => {
    const { standard, dropcontact } = mapCompany({
      website: 'https://www.acme.fr',
      company_linkedin: 'https://www.linkedin.com/company/acme',
      siret_address: '1 rue de la Paix',
      siret_zip: '75002',
      siret_city: 'Paris',
      siren: '500 500 500',
      siret: '500 500 500 00012',
      vat: 'FR12500500500',
      naf5_code: '62.01Z',
      naf5_des: 'Programmation informatique',
      nb_employees: '202',
      employee_count: '210',
      company_turnover: '12345',
      company_results: '6789',
      industry: 'Software',
    });

    expect(standard).toMatchObject({
      domainName: { primaryLinkUrl: 'acme.fr' },
      linkedinLink: { primaryLinkUrl: 'linkedin.com/company/acme' },
      address: {
        addressStreet1: '1 rue de la Paix',
        addressPostcode: '75002',
        addressCity: 'Paris',
        addressCountry: 'France',
      },
    });
    expect(dropcontact).toEqual({
      dropcontactIndustry: 'Software',
      dropcontactEmployeeRange: '202',
      dropcontactEmployeeCount: 210,
      dropcontactSiren: '500 500 500',
      dropcontactSiret: '500 500 500 00012',
      dropcontactVat: 'FR12500500500',
      dropcontactNafCode: '62.01Z',
      dropcontactNafDescription: 'Programmation informatique',
      dropcontactTurnover: 12345,
      dropcontactNetIncome: 6789,
    });
  });

  it('leaves the address alone without registry data', () => {
    expect(
      mapCompany({ siret_city: 'Paris' }).standard.address,
    ).toBeUndefined();
  });
});
