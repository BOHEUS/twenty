export const APP_DISPLAY_NAME = 'Lusha';

export const APP_DESCRIPTION =
  'Enrich People and Companies with Lusha contact and company data.';

export const APPLICATION_UNIVERSAL_IDENTIFIER =
  '456b2886-3598-47b3-bea3-9765e8d8d0e9';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  '684a0085-3e83-49b7-b0e5-3b53df6d4371';

export const LUSHA_API_KEY_VARIABLE_UNIVERSAL_IDENTIFIER =
  'fb02e308-8ed8-40a3-89fe-9d72908bd938';

export const LUSHA_REVEAL_PHONES_VARIABLE_UNIVERSAL_IDENTIFIER =
  'a2c7093e-d279-4857-a65b-1dff89086acb';

export const LUSHA_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIERS = {
  enrichPeople: '92563ade-895b-4c27-83f1-0c24aa7bc0ca',
  enrichCompanies: '8ecfafe1-dd46-458a-b24c-038540ea3cbb',
} as const;

// The front components behind the record-selection commands reach the bulk
// logic functions through these routes, served under the /s prefix.
export const LUSHA_LOGIC_FUNCTION_ROUTE_PATHS = {
  enrichPeople: '/lusha/enrich-people',
  enrichCompanies: '/lusha/enrich-companies',
} as const;

export const LUSHA_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS = {
  enrichPeople: 'b890bfb8-6d7b-4a79-98d7-b7210d9658ea',
  enrichCompanies: '4e99b1ca-575c-45a5-a058-5061a739586d',
} as const;

export const LUSHA_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS = {
  enrichPeople: 'cb436b69-18cf-4453-8fcb-5508990d0b94',
  enrichCompanies: 'e03c8345-1a2c-41ee-ad1f-db7ff47ddd36',
} as const;

export const LUSHA_VIEW_UNIVERSAL_IDENTIFIERS = {
  people: 'e46b825a-451f-426b-bb65-092b129737dd',
  companies: 'ff2ac25f-f87e-48b8-a12a-f2f744efb889',
} as const;

export const LUSHA_FIELD_UNIVERSAL_IDENTIFIERS = {
  person: {
    lushaId: 'f53e9fc4-e4bc-4686-8418-97de41adf775',
    lushaSeniority: 'f9adcd9f-d95b-481f-93f3-96a6247bddc5',
    lushaDepartments: 'd82c77c5-552a-4282-aceb-81a4d9a82152',
    lushaLocation: '73915961-62a6-4ae5-ba42-f5cb48ad8192',
    lushaXLink: 'ea606e8f-a400-4623-95ca-cc808b4c8974',
    lushaPreviousEmployment: '16914be5-7096-45d0-b24f-fea363cabe79',
    lushaEmailConfidence: '277f0149-a894-4f64-a481-54f69684fa79',
    lushaDoNotCall: '4da99245-3cff-481d-82fc-e8d831d45751',
    lushaIsEuContact: '0d49a595-8a35-4ec4-bdd0-293304ee45e0',
    lushaDataUpdatedAt: 'b4207c37-90a6-4d5c-a16d-a6d404ae68a9',
    lushaEnrichmentStatus: 'd8b96115-b4e3-4b82-8279-d83c3ecdd679',
    lushaLastEnrichedAt: '9e73993c-f4b0-4b71-b871-380b6cf3c35b',
    lushaRawPayload: '17c130ed-019b-450e-8912-181191d4f9ca',
  },
  company: {
    lushaId: '7b18a018-0baa-4f91-b2f5-ad20ff2e9efb',
    lushaDescription: '1e2dd415-d72f-44ec-b130-a3adc9fa724a',
    lushaIndustry: '4075bab4-78aa-4d84-bbf1-653c06206ead',
    lushaSubIndustry: '0ca59aac-1241-42f3-99c0-33e09ffe1457',
    lushaEmployeeCount: '81f4a7ae-0555-42f5-b213-0c365bb13156',
    lushaRevenueRange: 'bfd02516-4664-4655-b927-608da7e4585f',
    lushaFoundedYear: '5d7ea1bb-f490-4788-b325-52e2084ea56f',
    lushaCompanyType: '81a307c2-589e-4c5e-8088-87f2743203c6',
    lushaSpecialities: '81c20de7-5714-4011-a997-7c080eec0c33',
    lushaTechnologies: '5856ede6-7892-452d-a6af-ce152de7af3f',
    lushaSicCodes: '799d2091-7d2d-481d-a3c6-fc02460fefb0',
    lushaNaicsCodes: '101fdc0f-7b67-46ab-b862-af27f759e7a6',
    lushaTotalFunding: '762e3bcd-db3d-4d33-8a1b-3ef0a3c2a87e',
    lushaLastFundingType: 'db79b906-a3fb-465b-9682-2d22d23db50e',
    lushaLastFundingDate: 'd489487b-2365-429c-9177-a522172b878d',
    lushaLinkedinFollowers: 'a432191b-a748-4072-aaf9-2cc3769cf1a4',
    lushaXLink: '0f0e5ec6-6ac2-48ba-b3d8-ce17fc1e2f4e',
    lushaFacebookLink: '9398d52a-5eca-4042-865b-2e6d9f1f5e79',
    lushaPhones: 'bbf6bb73-7c1f-41fb-8f11-84a256e45e72',
    lushaLocation: '2dc6af34-ee93-431a-a736-95a0a58fbc80',
    lushaEnrichmentStatus: '26684a2b-f4f6-4189-8900-6e3351b91d38',
    lushaLastEnrichedAt: '40f19f56-42f1-4a6e-8acd-1c5dfdb4736b',
    lushaRawPayload: '4f8c20aa-87de-4307-9e79-2a34d531b3e5',
  },
} as const;
