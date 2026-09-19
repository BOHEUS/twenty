import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
} from 'twenty-sdk/define';

import {
  CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS,
  CRUSTDATA_VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: CRUSTDATA_VIEW_UNIVERSAL_IDENTIFIERS.enrichedCompanies,
  name: 'Enriched (Crustdata)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: '8f700251-96fc-4150-a9c2-78aa94972250',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.name.universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: 'b2077ac6-3d1e-4704-a7b6-0bf4259d21f3',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.domainName.universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: 'ce30c5a5-b72c-4dc3-82cc-0af97ad4a312',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.linkedinLink.universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: '07aa6cad-7adf-444a-bd02-fb22373bb22e',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataIndustries,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: 'ebdf9213-3086-4342-aee9-740c770b7f17',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataEmployeeCount,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: '535db58a-90a7-4b3f-ab6a-74fc674c30f0',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataEmployeeCountRange,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: 'a31beaf4-0515-421e-8740-405ffeaf3c17',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataHeadcountGrowth,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: '53f853b6-51f4-427c-b96d-c46bcdfaa230',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataFoundedYear,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: '50a451fd-3038-48f2-b36d-7368707493de',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataCompanyType,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: '1b3604c3-b93a-481a-baca-060ced6e3107',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataStatus,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: '0f3fe057-12f9-4fb0-8e8c-c5cbc67efbee',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataRevenueLowerBound,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: '1985831f-8947-403b-a44a-5091e076a6e7',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataRevenueUpperBound,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: '45adafa4-3ca2-45cf-9fc8-bef3f921eb9d',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataTotalFunding,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: 'a6917d58-d7b1-48f3-a11e-f650b4380775',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataLastRoundType,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: 'e759b516-feae-4689-96e3-75f1bc02516f',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataLastRoundAmount,
      position: 14,
      isVisible: true,
    },
    {
      universalIdentifier: '675abcd6-1149-48e9-b5e7-15b2c1a0fe8f',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataLastFundraiseDate,
      position: 15,
      isVisible: true,
    },
    {
      universalIdentifier: 'ea4cb6c2-8aa7-4df5-a57b-508304ae4054',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataInvestors,
      position: 16,
      isVisible: true,
    },
    {
      universalIdentifier: 'de66fe67-f88d-4adf-b788-eb64a3fb026f',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.address.universalIdentifier,
      position: 17,
      isVisible: true,
    },
    {
      universalIdentifier: '6e2db624-768c-4739-a9c9-752b4438b87c',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataOpeningsCount,
      position: 18,
      isVisible: true,
    },
    {
      universalIdentifier: 'f260ddfe-0224-4a8d-a933-2ed5cde951c1',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataOpeningsGrowth,
      position: 19,
      isVisible: true,
    },
    {
      universalIdentifier: 'a19c0a76-9f00-48cd-a0e9-c80dbc797a62',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataEnrichmentStatus,
      position: 20,
      isVisible: true,
    },
    {
      universalIdentifier: 'd3520a9f-91df-4460-9816-6f3296d6277a',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataLastEnrichedAt,
      position: 21,
      isVisible: true,
    },
    {
      universalIdentifier: '47fe514d-f374-41a6-8a71-1b81618b31bd',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataMatchConfidence,
      position: 22,
      isVisible: true,
    },
    {
      universalIdentifier: '3f1bece3-37bc-4c81-be13-c4d28b9cff3c',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataDescription,
      position: 23,
      isVisible: true,
    },
    {
      universalIdentifier: 'c87572e3-7379-45c7-aa0b-60cbe37b0ee2',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataSpecialities,
      position: 24,
      isVisible: true,
    },
    {
      universalIdentifier: '8a6247ec-e3be-4968-9672-c65911c7ac84',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataCategories,
      position: 25,
      isVisible: true,
    },
    {
      universalIdentifier: 'b6296f6a-d470-4076-b4d5-695776a6ec0b',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataMarkets,
      position: 26,
      isVisible: true,
    },
    {
      universalIdentifier: 'a5607ab6-c160-4575-909b-181ff707a0cf',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataAllDomains,
      position: 27,
      isVisible: true,
    },
    {
      universalIdentifier: '69ceb100-2c10-483e-91f3-50376cdc87e9',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataNaics,
      position: 28,
      isVisible: true,
    },
    {
      universalIdentifier: '02584168-2eb9-40cc-b8b3-0dd3301bc7d2',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataSic,
      position: 29,
      isVisible: true,
    },
    {
      universalIdentifier: '5ed5728d-a6bf-4f64-baac-7dbd74d2b18c',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataTickers,
      position: 30,
      isVisible: true,
    },
    {
      universalIdentifier: '7675555b-bc0d-4cbe-bb9f-1d166a60250d',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataIpoDate,
      position: 31,
      isVisible: true,
    },
    {
      universalIdentifier: '0e564bde-97d4-4776-9143-dde3e6fbe552',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataAcquisitionStatus,
      position: 32,
      isVisible: true,
    },
    {
      universalIdentifier: '6aa38396-e863-4274-9fa6-908ef05b3cf7',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataAcquisitions,
      position: 33,
      isVisible: true,
    },
    {
      universalIdentifier: '2606891c-d592-4885-9b5e-768d8a569ce5',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataHeadcountBreakdown,
      position: 34,
      isVisible: true,
    },
    {
      universalIdentifier: 'ab877758-6a82-439b-85b1-6dc03bf7d7d1',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataRecentOpenings,
      position: 35,
      isVisible: true,
    },
    {
      universalIdentifier: '5d6b162d-9290-43cc-a550-8fca4add1f54',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataWebTraffic,
      position: 36,
      isVisible: true,
    },
    {
      universalIdentifier: '28cc867e-d53a-47b5-a6cd-b6489e72dc36',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataSeo,
      position: 37,
      isVisible: true,
    },
    {
      universalIdentifier: '14559a77-14bf-40de-8be8-7739aa9903d8',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataCompetitors,
      position: 38,
      isVisible: true,
    },
    {
      universalIdentifier: '495d667d-5278-4257-95eb-247824cad490',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataEmployeeRating,
      position: 39,
      isVisible: true,
    },
    {
      universalIdentifier: '40b27411-4efe-46e3-8ad7-de06a9d8b748',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataSoftwareRating,
      position: 40,
      isVisible: true,
    },
    {
      universalIdentifier: 'c3b00eeb-e9c3-484d-9d7e-467d00639586',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataKeyPeople,
      position: 41,
      isVisible: true,
    },
    {
      universalIdentifier: '8f73f148-c5d7-402d-83b9-5e8a3cc886eb',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataXLink,
      position: 42,
      isVisible: true,
    },
    {
      universalIdentifier: 'f7983187-16d0-4277-b84e-111147afdbfa',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataCrunchbaseLink,
      position: 43,
      isVisible: true,
    },
    {
      universalIdentifier: 'e4ab5d0b-be70-4f4e-a597-e3a4737c9430',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataFollowers,
      position: 44,
      isVisible: true,
    },
    {
      universalIdentifier: '628de516-0488-4992-8dcd-f8e165e434f2',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataNews,
      position: 45,
      isVisible: true,
    },
    {
      universalIdentifier: '0ee3868e-0c74-4ac9-b15b-48cebc34a273',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataOfficeAddresses,
      position: 46,
      isVisible: true,
    },
    {
      universalIdentifier: '67cf6767-ba4f-4834-b238-425ec3513921',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataLinkedinId,
      position: 47,
      isVisible: true,
    },
    {
      universalIdentifier: '82b5b161-d2f2-46c5-96f4-61fda0fdb23d',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataCompanyId,
      position: 48,
      isVisible: true,
    },
    {
      universalIdentifier: 'acb6c35b-1513-4bea-ab3b-5429e4c05954',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.company.crustdataRawPayload,
      position: 49,
      isVisible: true,
    },
  ],
});
