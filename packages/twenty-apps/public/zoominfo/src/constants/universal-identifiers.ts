export const APPLICATION_UNIVERSAL_IDENTIFIER =
  '46d8fd6b-47d3-4726-bc5b-fa746488206a';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  '9191fea6-0de3-40d0-a438-707f94765c05';

export const ZOOMINFO_LOGIC_FUNCTION_CONSTANTS = {
  enrichPeople: {
    universalIdentifier: 'a435526a-dfc6-497b-b1fd-5e492576f92e',
    path: '/zoominfo/enrich-people',
  },
  enrichPerson: { universalIdentifier: '334ba6d7-3df0-4442-aa97-a7cb12a53674' },
  enrichCompanies: {
    universalIdentifier: '5b7123e0-a2d6-4d0a-948d-185f3918a59e',
    path: '/zoominfo/enrich-companies',
  },
  enrichCompany: { universalIdentifier: 'fc881448-58c5-4f69-bdb0-e6a007bfbc4a' },
  postInstall: { universalIdentifier: '02399ba1-4781-4ed4-8425-295d8afab30d' },
} as const;

export const ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS = {
  person: {
    zoomInfoContactId: 'dd79511d-3581-4494-b2bc-d089ae722b1a',
    zoomInfoCompanyId: '4156954d-653e-4e79-99a0-cf5632541678',
    zoomInfoContactAccuracyScore: 'd95e205f-407a-4643-b38c-744e50519b02',
    zoomInfoManagementLevel: '1e78c954-a2a9-41f5-ba20-535f4fc61582',
    zoomInfoJobDepartment: '2153eafe-4646-48c6-ba9d-bf6be5b9dcf4',
    zoomInfoJobFunction: 'f5f3d099-3d87-4e85-8f80-c485551f52c3',
    zoomInfoPositionStartDate: 'c370998d-0786-4294-996d-a6b2c54680db',
    zoomInfoYearsOfExperience: '3ea7431a-82ec-422a-8e69-7485e298c934',
    zoomInfoTechSkills: '65c69647-5fe2-4153-b70d-3e8164f04e92',
    zoomInfoEducation: '111cdbe7-a056-43ea-95bd-0fe789f7aa16',
    zoomInfoEmploymentHistory: 'b179f1c6-3f4a-4d11-b862-872767ff98b3',
    zoomInfoExternalUrls: '1f8a9f31-147a-4187-8ed3-e3a9a83ffbc6',
    zoomInfoLocation: '16a2365c-ac6b-49a6-bb79-8a4b1f8e7eb3',
    zoomInfoMetroArea: 'bd87fba2-841a-4e68-9820-607527a6843a',
    zoomInfoPersonHasMoved: '80c55d03-101a-4286-864e-e08b0fca1adb',
    zoomInfoWithinEu: '30d881ee-29d0-42ef-b2ac-0bc990d046ed',
    zoomInfoWithinCalifornia: '3051f7fe-912b-4031-a364-85c9c08e2c00',
    zoomInfoWithinCanada: '65c55a3a-fe55-4985-b114-a2f3729abaa3',
    zoomInfoValidDate: '43e77bbc-fcc7-400a-a709-1a533e5e78b5',
    zoomInfoLastUpdatedDate: 'f4a4d5a7-1c15-4bdd-ad35-3af403b322da',
    zoomInfoMatchStatus: '69cfa606-bc78-43ee-864d-26270c8a38bf',
    zoomInfoEnrichmentStatus: '9c12fcc9-d99d-429d-9019-04b610fad7de',
    zoomInfoLastEnrichedAt: '6317bd0b-5b66-44c1-968f-4580a24f2005',
    zoomInfoRawPayload: '4d5c21a5-f008-4b9a-9ecf-90c446f6f650',
  },
  company: {
    zoomInfoCompanyId: 'cd610737-e749-4ec7-a51e-4e5515e7ba2b',
    zoomInfoEmployeeCount: '080137a2-c356-4ab3-96d2-1f04e263d638',
    zoomInfoEmployeeRange: '26befa91-d14e-4bac-87ba-871f3c3b7aec',
    zoomInfoRevenueRange: '0144a8e7-a615-4875-955f-eecdffdd35db',
    zoomInfoPrimaryIndustry: '9123e20c-3a4b-4637-a5bb-c2f4e35657c9',
    zoomInfoIndustries: '19d3009e-cffe-4f64-ab2b-8c9807bbbe8f',
    zoomInfoSicCodes: 'bf0e9b66-eeac-4019-8188-93f49a9534ab',
    zoomInfoNaicsCodes: '40c9df3e-2f7b-46b5-adfa-7fcec840f895',
    zoomInfoCompanyType: 'f797feea-fbce-4eda-8cb8-3f4295b3626e',
    zoomInfoCompanyStatus: '5bb4f930-80bd-4fc2-ae37-f02d4f342dfb',
    zoomInfoTicker: 'c411f227-ad39-4a7f-b291-19e32142f428',
    zoomInfoFoundedYear: 'a3e4bd49-274e-4ce8-96ad-a7d65ac3d799',
    zoomInfoTotalFunding: '56ca2a8b-5452-40e3-bdbf-02671f5f6674',
    zoomInfoRecentFundingAmount: '0e4675bf-5b18-46eb-a186-54e63b66b460',
    zoomInfoRecentFundingDate: '001ecbe0-2e1b-4ff9-8e86-223a23ee9d01',
    zoomInfoLocationCount: '69731f87-55f1-4099-9c10-4c34b93cb584',
    zoomInfoMetroArea: 'cc241e2a-2cb6-44e2-b005-dee62e9b0373',
    zoomInfoContinent: '0d40e5aa-bfb8-4d96-9605-916781ad5149',
    zoomInfoParentName: '119258aa-eeda-4ec0-913e-8cb23e45c550',
    zoomInfoUltimateParentId: '405ad4d4-b742-4e9a-8907-54e2c02fa41e',
    zoomInfoUltimateParentName: '7432b693-f178-4579-aa8a-0f0dc7907a4f',
    zoomInfoContactCount: '9636355c-d7a0-4a50-acdc-817d3d9d42b8',
    zoomInfoDescription: '121c43d1-1b1a-4fea-a6cb-60b825b0a6f0',
    zoomInfoCompetitors: '208e5b8a-ae5d-43c6-8e2b-7e52928fdfb7',
    zoomInfoEmployeeGrowth: '07fd3d37-3170-4bf1-8340-31d3976a6b78',
    zoomInfoEmployeeCountByDepartment: 'f5b3d515-2032-481a-8ad7-161a616625b7',
    zoomInfoIsDefunct: 'e093890b-a8e5-4e7b-9853-48a20f1f06d2',
    zoomInfoMatchStatus: 'f27c56d5-d013-4943-9cc6-745da0ec590e',
    zoomInfoEnrichmentStatus: '6537afbf-aa15-4f60-8f27-ce9018afcb02',
    zoomInfoLastEnrichedAt: '631e0baa-1793-4918-8a15-60affa50d2bc',
    zoomInfoRawPayload: 'ffc15a99-088d-40cb-abe2-61e7d2578aad',
  },
} as const;

export const ZOOMINFO_SELECT_OPTION_UNIVERSAL_IDENTIFIERS = {
  personEnrichmentStatus: {
    matched: 'fd220d9b-1ee0-4408-a924-4e065b85eb02',
    notFound: 'f3ad3ce3-1992-43f5-b884-8f2760962685',
    error: '6fc6c607-315b-48d4-84ac-8bf8551fff7f',
  },
  companyEnrichmentStatus: {
    matched: 'f9594861-5c94-4ed2-8ce2-478c89d871d0',
    notFound: '619d4c46-2ec9-4620-9377-551430fbb4b3',
    error: 'ed3d6c96-ca1e-4401-87b2-8bb96f4a12a2',
  },
  contactMatchStatus: {
    fullMatch: '6faa4914-a454-46af-9c70-528e7e4b1eb6',
    contactOnlyMatch: 'a194f05a-9635-43bc-a5ec-bde1292ebfe2',
    companyOnlyMatch: 'dde46786-650b-4925-b428-341d6e6685ea',
    noMatch: 'a8a1e2d1-60d1-4a08-b14e-855f6ef6c7d4',
    nonMatchByLastUpdatedDate: '6fbd47ee-6786-4d1c-8260-9092efe42950',
    nonMatchByValidDate: 'a2f23680-9974-40bb-8094-50202b5a4455',
    nonMatchByRequiredFields: '2b7bdc7a-ed09-4f9e-8138-81475913bcfa',
    nonMatchByContactAccuracyMin: 'c2170bce-7104-4ab8-be6e-79cdf9877836',
    optOut: '583e92a0-4100-4e1a-95fc-2d0e45087be2',
    limitExceeded: '43ba81a9-2905-443d-b43c-02e22152be4a',
    invalidInput: 'd108ed7f-8cda-4f5e-98bb-8aeba727d176',
  },
  companyMatchStatus: {
    fullMatch: 'c9fb8805-7e0c-4645-a848-74f7651a729d',
    noMatch: '5df8cf5b-a9fd-4875-9507-c7fee146d1be',
    limitExceeded: '2f63a002-6bb7-4c4d-a662-e177e4448f9f',
    invalidInput: 'a48ea6be-6a17-4d98-9a72-ef262719fe82',
  },
  companyType: {
    private: '85342984-d961-446c-aafa-c810e8633ea7',
    public: '531b97c5-713b-43b6-a31c-d1007d094ac4',
    npo: 'c1c532fe-c948-4701-9fbc-3d2a28cc8a36',
    education: '639fae09-ea9a-422a-bd69-d1d2fdfda936',
    government: '8ed19383-6dc5-419f-9593-ead499ab4dc8',
    other: '13c6f59c-4731-49f2-95b0-e98604ac3ea2',
  },
  companyStatus: {
    alive: '8118dc3f-a3c7-4832-9a7c-2160ea276ef6',
    new: '7e6e24c2-d6f7-4ce0-9fad-14c4eda1547d',
    defunctDomainDown: '993b5a1f-333a-485b-bf54-c486dbbf88e9',
    defunctDeclaration: '405772a1-8e8f-4cdf-b9ec-3448039afc09',
    defunctManual: 'b059d64d-1e15-4037-862e-1e13e72eee3e',
    defunctFormerName: 'eb469b55-83db-4369-9057-ba29b0f09fbe',
    defunctAcquisition: '40953cfb-c590-4ab0-95d2-e3acdb271de2',
  },
} as const;

export const ZOOMINFO_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS = {
  enrichPeople: 'e376d0f7-d37e-4d3d-81fe-f165556c2c21',
  enrichCompanies: '793e61ce-4d83-4715-abfd-3ca35f8742fe',
} as const;

export const ZOOMINFO_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS = {
  enrichPeople: 'e7aeba65-4bf5-4946-a6ec-50626c41709b',
  enrichCompanies: '5fb48300-7303-4f79-a000-065056d9c022',
} as const;

export const ZOOMINFO_VIEW_UNIVERSAL_IDENTIFIERS = {
  enrichedPeople: '92cbad6f-fbe4-4f7b-8633-38ebc6739c5a',
  enrichedCompanies: 'c651880f-fde0-479e-8193-7e07415be48f',
} as const;
