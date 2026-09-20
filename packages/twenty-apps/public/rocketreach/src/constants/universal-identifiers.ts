export const APP_DISPLAY_NAME = 'RocketReach';
export const APP_DESCRIPTION =
  'Enrich People and Companies with RocketReach contact and firmographic data.';

export const APPLICATION_UNIVERSAL_IDENTIFIER =
  'd3ddb070-c375-479d-badf-a36f3ece9f88';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  'd1bd8e01-3c26-47ce-97a1-64da9ef34e5e';

export const ROCKETREACH_LOGIC_FUNCTION_CONSTANTS = {
  enrichPeople: {
    universalIdentifier: '554da40d-e4cf-4908-a94c-febd51a74f52',
    path: '/rocketreach/enrich-people',
  },
  enrichPerson: { universalIdentifier: 'ab9ca5f3-8c21-49a0-902a-3a19b5bfabf1' },
  enrichCompanies: {
    universalIdentifier: '24c98f8b-bcc9-440e-8c97-22910d94787c',
    path: '/rocketreach/enrich-companies',
  },
  enrichCompany: { universalIdentifier: '3558061d-0b68-4dbf-89f8-077d303a25c0' },
} as const;

export const ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS = {
  person: {
    rocketReachId: '8640c002-9fcc-46c9-bab4-485f99a1d08b',
    rocketReachEnrichmentStatus: '4e6b1e40-b3f2-4b24-8c21-7053f9b64e9b',
    rocketReachLastEnrichedAt: '27c0d730-f473-4e35-958d-6b71da0e78e6',
    rocketReachLocation: 'f4150d17-c1e1-46cb-ab87-78782695847e',
    rocketReachDepartment: 'c6993b58-4efd-4c62-95ea-b77c57414746',
    rocketReachSubDepartment: 'a045636c-be2c-49a8-89da-786a2dcc5cc7',
    rocketReachSeniority: 'b30d1115-70c6-420d-aea2-745381433ac3',
    rocketReachJobHistory: 'a3ed5e92-5bc5-4674-b795-b1af8c8b1700',
    rocketReachEducation: '989379e5-34b8-45df-9ee5-c1366ca00822',
    rocketReachSkills: '073361d2-b3b4-46a3-8ec8-9029a3d261b2',
    rocketReachLinks: 'fedfbbf4-029e-497b-b57d-c6e82564ea63',
    rocketReachLinkedinConnections: '197cf33d-1610-43f8-a3b4-4167c2aa0c58',
    rocketReachLinkedinActive: 'e89d92ca-ce1e-4013-a390-21fd4c011993',
    rocketReachBirthYear: '28581220-ef8b-4f93-b7d8-dbed5b241614',
    rocketReachEmailDetails: 'ef2781e6-07e9-4582-9a84-625b8646ff31',
    rocketReachPersonalEmail: '7a339737-055c-47e9-8129-1b00e0f53320',
    rocketReachPhoneDetails: '127b6108-cfd8-402b-a9a1-dae53a5b4159',
    rocketReachNpiData: '89290a79-715f-4c60-962d-480d6cce43df',
    rocketReachRawPayload: 'd87ef59a-97e2-42bc-b4a7-5082f27d2908',
  },
  company: {
    rocketReachId: '8b6d204e-0b30-4217-b6b3-f83301372655',
    rocketReachEnrichmentStatus: '31443029-32f5-435f-894e-fd37a8f9d5cd',
    rocketReachLastEnrichedAt: '7ec13bb4-58a0-408a-94be-72bea3031d08',
    rocketReachProfileLink: 'f241a4c7-9ddc-4461-ba3f-cc5b74b80d5e',
    rocketReachDescription: '30ab856d-dd6a-4624-a8c8-ea52ad6a83bc',
    rocketReachIndustry: '75085c9d-8790-410f-b817-7eac07ce1cb6',
    rocketReachIndustries: 'df8a5580-e18c-4d38-a2be-a131dfa681d0',
    rocketReachIndustryKeywords: 'f4775f26-1fb6-4ab8-9569-a22ac614661b',
    rocketReachEmployeeCount: '385a27fa-51ed-47cf-b5d9-c8bbd047760c',
    rocketReachFoundedYear: 'cee771e7-fd0d-4d32-883b-73c02e42fafa',
    rocketReachEmailDomain: '5043a5e7-0e2b-410d-b82b-a8003ac61d41',
    rocketReachDepartmentHeadcount: '50dff602-3de5-42c1-b3c2-cd37a44bd794',
    rocketReachSicCodes: 'd57c9ea1-1ab5-4d58-9179-43a7fd3df181',
    rocketReachNaicsCodes: 'e8500d6a-b76c-4d55-95b8-a22ad5d46418',
    rocketReachPhone: '58aa61c0-7817-419f-b962-23a62765e554',
    rocketReachFax: 'b36872aa-e56d-440c-b9b7-1906819b38be',
    rocketReachTickerSymbol: '07761f37-6a43-4975-953a-26ea7344d205',
    rocketReachFundingInvestors: '6d050213-6f30-4dab-a382-a6ccfcb81e47',
    rocketReachTechstack: 'f96414e3-063d-45e1-bde7-7e6e064eae9c',
    rocketReachCompanyGrowth: '96db7e99-9357-4b7a-91ea-6e264899bbf4',
    rocketReachCompetitors: '3699f331-23d1-49a4-ad8c-f14b053a4f51',
    rocketReachTwitterLink: '5c5f98bd-7c24-435e-b7e0-704f65172691',
    rocketReachFacebookLink: '78abbd56-7bd7-462f-8861-c0b6dcef8d3a',
    rocketReachRawPayload: 'e1ef5045-2cca-400e-b684-b31d4c4a8e6f',
  },
} as const;

export const ROCKETREACH_SELECT_OPTION_UNIVERSAL_IDENTIFIERS = {
  personEnrichmentStatus: {
    matched: '68f4e1e6-c262-4d16-8c88-145c8a380f88',
    pending: '01148327-e96f-4b1d-be1a-fec73790c286',
    notFound: 'f6351e89-02cf-48b2-b2e6-fe1fec59cb4d',
    error: '54cd4f8b-74f9-462f-9f03-5b4b861ccf13',
  },
  companyEnrichmentStatus: {
    matched: '70d3401c-14b2-4099-95a8-7e94c374ff8c',
    pending: '2b4410c8-89a4-4e2f-a604-5d2bf8715dd8',
    notFound: '7889de6d-54ce-4574-8ba5-7c8a5f196326',
    error: '22aafbc7-b3cf-45c9-85d7-02a311927f8a',
  },
} as const;

export const ROCKETREACH_VIEW_UNIVERSAL_IDENTIFIERS = {
  enrichedPeople: '59408693-68a4-4102-b9ab-42a303ac7db9',
  enrichedCompanies: '9f5b1129-6d2f-44d2-b92a-5a9caa37b742',
} as const;

export const ROCKETREACH_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS = {
  enrichPeople: 'f2067062-9f26-497c-8bbb-06f37511588f',
  enrichCompanies: '6238c96a-abe2-4207-b307-512996bfc7df',
} as const;

export const ROCKETREACH_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS = {
  enrichPeople: 'fc8aacc3-7eb4-4fcb-8fe1-a487c07afc25',
  enrichCompanies: 'eb811fb5-c754-4d93-a369-0cc4318d188c',
} as const;
