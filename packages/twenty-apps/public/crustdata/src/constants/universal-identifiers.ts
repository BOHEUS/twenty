export const APPLICATION_UNIVERSAL_IDENTIFIER =
  '5da479c6-0f28-46e9-99d4-0843eda9810a';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  '2a0c36ff-0962-4643-9dda-d2550fa09aa7';

export const CRUSTDATA_LOGIC_FUNCTION_CONSTANTS = {
  enrichPeople: {
    universalIdentifier: 'd611b8c7-dbaa-4854-ae4d-578557dc1fcc',
    path: '/crustdata/enrich-people',
  },
  enrichCompanies: {
    universalIdentifier: 'b9d94d1e-d73e-4179-b59e-238b34d6d2e5',
    path: '/crustdata/enrich-companies',
  },
  postInstall: { universalIdentifier: '8e6c8713-25d6-4cc5-8f69-8e47bd5d7d2c' },
} as const;

export const CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS = {
  person: {
    crustdataPersonId: '53979f4e-1095-480a-a93d-0bd3843b506e',
    crustdataHeadline: 'b0c8625e-0e84-497a-82f6-fceca79458a1',
    crustdataSummary: 'afaf2def-cade-4f4d-b614-3ef352244fe9',
    crustdataLanguages: 'af13b090-3d8e-40c0-9e8b-23c4b0b794bd',
    crustdataPronoun: 'df060e86-6240-475a-bc69-2cf88eaa8940',
    crustdataAuthenticityVerdict: 'c0345a36-fff3-4081-80f5-fc688d581720',
    crustdataAuthenticityTier: '8f7677bf-d4f0-4f4f-aba7-5cdd8d585698',
    crustdataLocation: '11a1df1b-79f2-478c-92ab-037aac37f75a',
    crustdataDepartment: '6116d0b2-9d28-4d46-ac04-42ff354d3d8f',
    crustdataSubDepartment: '2666cc86-7551-484d-9f0e-f22362ba9006',
    crustdataNormalizedTitle: 'adf505ca-523e-438e-8548-1a553b6583f9',
    crustdataYearsOfExperience: 'eaa3e23e-e49c-46dc-889b-ed694ef8bd01',
    crustdataCurrentJobStartDate: 'b6f6aa27-7bed-4e09-a2a2-6515d63b1b19',
    crustdataPastEmployment: '53d11c9b-6ceb-47b2-aae7-52d0547af9c1',
    crustdataEducation: 'b698699f-dd79-4e1c-8363-620796a7d4eb',
    crustdataSkills: 'ceddc34b-0562-4a01-8abc-be0c96c5e336',
    crustdataCertifications: 'd3c44460-31ef-446d-8145-c8cb5245e39e',
    crustdataHonors: 'b19b5a7f-5d58-48fc-a5b3-9ec9f7da55b9',
    crustdataXLink: '507b8efc-45b5-4f09-8948-599c0bc14b7f',
    crustdataGithubLink: '95f00d22-dac9-4b7c-af49-226ab9935ddc',
    crustdataDevPlatformProfiles: '6f03f540-415f-4b04-bc89-6708cd8ce6c8',
    crustdataConnections: '974e9ab3-0498-427d-8fc6-6146514a4edd',
    crustdataFollowers: '66861e2b-12a2-408a-8495-3bffdc36182b',
    crustdataWebsites: '6d8fcd78-ef6c-4534-91f6-77d5345045c4',
    crustdataEmailStatus: '89724368-35a4-4af3-a9ee-c4ad27d7c26b',
    crustdataProfileUpdatedAt: '093721a7-2e1e-4bad-bba5-00c1609319f3',
    crustdataMatchConfidence: '48704158-c8c1-49b5-9c26-4187f3617f75',
    crustdataEnrichmentStatus: '9cd20b88-9f07-4117-bb04-ab6eb91ce0af',
    crustdataLastEnrichedAt: 'c9eba0ae-916d-47dc-9b67-6eea7bf62403',
    crustdataRawPayload: '783647b2-e291-438a-b610-c7c15729131b',
  },
  company: {
    crustdataCompanyId: '1090a0f2-9805-47fb-8d13-6f8268e01f2a',
    crustdataLinkedinId: '9a87c486-ffbd-43d6-8c62-a35463b52299',
    crustdataDescription: '1d40c50f-9fbe-4c46-a387-e3cb454ce22d',
    crustdataCompanyType: '154b6f61-542c-4764-b3e9-35f7879b9eb2',
    crustdataStatus: 'e9ca64ef-b640-4f84-869d-81a37a8fea0a',
    crustdataFoundedYear: 'da3fc010-5782-478e-b5d2-d3da946ddaed',
    crustdataEmployeeCountRange: 'f00cb6d1-6b6f-47b6-81cb-137a186d42e8',
    crustdataEmployeeCount: '05f19a70-2f10-4757-8969-11612bb82e71',
    crustdataIndustries: 'c082d15e-848a-46a3-93c8-7c9ec6a2a5b5',
    crustdataMarkets: '12bdd8c8-7c12-4ba7-81fe-55824b596c9d',
    crustdataAllDomains: 'c1ca1e6d-e3c6-4bd6-9fc2-51afd2cd33bf',
    crustdataSpecialities: 'a8903b63-6687-4be9-b349-772f36f9d9c5',
    crustdataCategories: 'b86d1387-9881-4a19-ac09-8150eb2873f3',
    crustdataOfficeAddresses: '18ad6e37-da09-4a62-9c29-2efc91c61fad',
    crustdataNaics: '32009f14-4d4b-46cd-a781-fbfa5d6a2654',
    crustdataSic: '7ccbc087-396b-47b9-a094-6386d1509917',
    crustdataRevenueLowerBound: '62965be4-03c8-49c0-a09c-cafa5460b023',
    crustdataRevenueUpperBound: '956e62b5-a9fb-4a1a-9bd3-ee7cb1fda0f6',
    crustdataTickers: 'd409fbf0-ebc6-4958-8bf7-7298a7d3a8d1',
    crustdataIpoDate: '4b7370a1-198a-47d8-8981-004b59a9c44b',
    crustdataAcquisitionStatus: '1fe478c4-63e7-46b3-9477-d56ac325bb7d',
    crustdataTotalFunding: 'e307410f-75a0-4571-9142-6f4634d56ce5',
    crustdataLastRoundType: 'a2d40ae7-dceb-448d-a789-49cd22e97451',
    crustdataLastRoundAmount: '4327fc84-96df-41dd-9bd0-716b6fa7aa94',
    crustdataLastFundraiseDate: '29fe0258-eb31-436a-833d-479e818243a3',
    crustdataInvestors: '0b07cdac-99c4-4557-9b12-c841124f4233',
    crustdataAcquisitions: 'a0f45eea-fe43-4702-95aa-c4969b959b9f',
    crustdataHeadcountGrowth: 'd4d1522f-89ee-4880-bb4a-968e84e39995',
    crustdataHeadcountBreakdown: '09d4ffbc-017e-4e31-847d-676bca501c2f',
    crustdataOpeningsCount: 'e6a82b62-8264-430a-a667-400aa1122a63',
    crustdataOpeningsGrowth: '78997b0d-2d75-44e9-a354-51bde290e538',
    crustdataRecentOpenings: 'c707a812-135d-49de-b3c0-10cbfadb377d',
    crustdataWebTraffic: 'fe4e9891-0f8b-4887-b660-8ae9c4aadf2d',
    crustdataSeo: '7db22090-cff1-4684-a413-c95c3541061f',
    crustdataCompetitors: 'f0df96f3-6259-40bc-bfd8-949298f67aa3',
    crustdataEmployeeRating: '775ac077-20be-4c02-a593-037856def8b2',
    crustdataSoftwareRating: '64289ee5-059a-4070-9f48-3956703ad930',
    crustdataKeyPeople: '55341bca-8119-438e-a01a-5f9f1b1d56c8',
    crustdataXLink: '9a05aa27-4ec2-424a-ba85-987cfb774f4a',
    crustdataCrunchbaseLink: '51b033e8-5ea7-463d-bc1b-1a0f057dbc27',
    crustdataFollowers: '65528b34-c61d-4775-8440-889628e50d32',
    crustdataNews: '7a08ebe9-254e-41ff-9c30-5760bfe2932b',
    crustdataMatchConfidence: 'ff41a3b3-9c83-4f58-8a6f-2623f0cba6ab',
    crustdataEnrichmentStatus: 'f0620b10-342f-497d-b4f3-1d5cbfa5c12d',
    crustdataLastEnrichedAt: 'd3d6a715-b274-451b-b6d1-cf137d6330f7',
    crustdataRawPayload: 'd685ed03-d63a-498d-aded-bc13e1743f02',
  },
} as const;

export const CRUSTDATA_SELECT_OPTION_UNIVERSAL_IDENTIFIERS = {
  personEnrichmentStatus: {
    matched: 'a048c1d4-de56-46b9-ae52-f0e4a1153187',
    notFound: 'cfaf51e1-8224-4230-aec8-c7a47bdb05de',
    redacted: '2a6d780d-4ea1-492b-9ae0-f33ae31730cc',
    error: '720badca-f549-4697-bad5-2061b0e43958',
  },
  companyEnrichmentStatus: {
    matched: 'e514e709-4678-4fac-a22c-735c763b5e25',
    notFound: '04e6f476-7841-4348-9059-49add254ff77',
    redacted: '3fe0da00-715f-4cb5-9b9e-7eca7e520275',
    error: '294fb303-dfcd-4673-a48e-61bf1ad16966',
  },
  authenticityVerdict: {
    clearlyGenuine: '3b03b8c3-f30f-4afd-b769-29e30ff60bc5',
    probablyGenuine: 'c7c0a700-0992-42fa-a6b9-69c16c206288',
    cannotVerify: '3e1b53f8-b844-4246-ba8b-48414eb4cff9',
    probablyFabricated: '24fec548-5a9d-4e35-80b6-60bd17064a26',
    clearlyFabricated: '6e094a9c-b45c-4bff-a236-bdf951498eb2',
  },
  emailStatus: {
    deliverable: 'b6fa5346-d02f-40bf-a4da-8b3178617798',
    catchAll: '7e01ca1a-bdb5-400f-aa4b-014b03491e1c',
    invalid: '16466888-f8d7-4eec-8d68-1911ee1f4de3',
    unknown: 'd1581676-3ced-4d07-9285-7ac2837570d3',
  },
} as const;

export const CRUSTDATA_VIEW_UNIVERSAL_IDENTIFIERS = {
  enrichedPeople: 'ebf06ee1-a8cb-4116-8c1a-38fdf30ec824',
  enrichedCompanies: '606f5376-0f48-490e-a53d-6390c9b5c735',
} as const;

export const CRUSTDATA_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS = {
  enrichPeople: '34a6339f-c42f-4ced-8935-d20e414dc243',
  enrichCompanies: '75040cea-600b-4f8a-a904-7be488557751',
} as const;

export const CRUSTDATA_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS = {
  enrichPeople: '01dbe478-a9b4-4592-9e4f-044e5eac30f5',
  enrichCompanies: '2666e532-822d-4d8a-90a8-be0a6c2efffe',
} as const;
