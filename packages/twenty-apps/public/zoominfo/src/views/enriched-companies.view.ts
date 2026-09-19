import {
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
  defineView,
} from 'twenty-sdk/define';

import {
  ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS,
  ZOOMINFO_VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: ZOOMINFO_VIEW_UNIVERSAL_IDENTIFIERS.enrichedCompanies,
  name: 'Enriched (ZoomInfo)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: '457c34a3-a8b1-43a8-96c7-5d54b6cecd69',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: '6103ab43-56ad-4fb8-a18a-995bcb9a62d1',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.domainName
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: '7b409846-0fcc-4df9-b6ac-e59cf7ddf2d0',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoPrimaryIndustry,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: 'ac193520-6cb0-45b4-a0c7-e9f2821b6db2',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoIndustries,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: '462426f5-76e5-4a19-a165-0a8c87fba48a',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoEmployeeCount,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: 'e3082d4b-2174-4a46-844f-aceec90ea51d',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoEmployeeRange,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: '5a209a29-e974-4e16-a166-ed62de8097f4',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.annualRevenue
          .universalIdentifier,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: '98992bd9-f359-47d7-81ea-935ceef556a5',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoRevenueRange,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: '4bdff964-2155-4681-9d28-c98911e1467c',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoCompanyType,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: '4d9aeb75-da5b-4da8-8887-6964922964ca',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoCompanyStatus,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: '6bcfa95a-bfda-4f0e-8c80-3ca01b7d0de4',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoFoundedYear,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: 'd4b466f6-f626-4ffc-9c2c-b8e2fba02e77',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoTotalFunding,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: '8cfe82d2-5842-4c06-860b-3fe0da5bb9da',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoRecentFundingAmount,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: '8b1d0fe2-4093-4a53-b2da-9ef8b7fbdb62',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoRecentFundingDate,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: '7cfe24d4-61c6-48ec-b02b-3d1331f1fce4',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.linkedinLink
          .universalIdentifier,
      position: 14,
      isVisible: true,
    },
    {
      universalIdentifier: 'c0382a2b-ee87-48c5-8fe0-62c29c7f0b93',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.address
          .universalIdentifier,
      position: 15,
      isVisible: true,
    },
    {
      universalIdentifier: '5f77d4b0-8d52-4d6b-9078-ab25626c25cb',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoMetroArea,
      position: 16,
      isVisible: true,
    },
    {
      universalIdentifier: 'a29da60f-b468-4dfc-9fb8-e4e082cbfefe',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoContinent,
      position: 17,
      isVisible: true,
    },
    {
      universalIdentifier: 'a8a99e4f-9c08-4500-863d-866bc97a120d',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoLocationCount,
      position: 18,
      isVisible: true,
    },
    {
      universalIdentifier: 'c1122a84-c0f3-4b2b-a5ac-b56097454a7f',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoParentName,
      position: 19,
      isVisible: true,
    },
    {
      universalIdentifier: 'daf62276-6b03-4bd0-8169-ce647414fb18',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoUltimateParentName,
      position: 20,
      isVisible: true,
    },
    {
      universalIdentifier: '6c5b4c51-5fb2-4e05-858e-2cb96806ce01',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoContactCount,
      position: 21,
      isVisible: true,
    },
    {
      universalIdentifier: '44a306ff-4a61-404d-acee-f03b0f667ff2',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoTicker,
      position: 22,
      isVisible: true,
    },
    {
      universalIdentifier: '84ceceb0-74c7-42d5-84b1-8b587edf4299',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoIsDefunct,
      position: 23,
      isVisible: true,
    },
    {
      universalIdentifier: 'a6280680-3ae5-481c-ad64-5dace490fc6c',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoEnrichmentStatus,
      position: 24,
      isVisible: true,
    },
    {
      universalIdentifier: '9ea80384-90fa-497f-8615-d7d2dcf72fe5',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoMatchStatus,
      position: 25,
      isVisible: true,
    },
    {
      universalIdentifier: '884dfb4f-ed01-4f70-b8d2-52da47e34188',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoLastEnrichedAt,
      position: 26,
      isVisible: true,
    },
    {
      universalIdentifier: '1294c5d4-9642-495f-b744-03f3e8b1ae32',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.accountOwner
          .universalIdentifier,
      position: 27,
      isVisible: true,
    },
    {
      universalIdentifier: 'cfd130ad-bf73-48d9-882e-47a6b3341fb8',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.people
          .universalIdentifier,
      position: 28,
      isVisible: true,
    },
    {
      universalIdentifier: 'f5aa7cee-a0f0-4721-bc24-59f855d5b677',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.opportunities
          .universalIdentifier,
      position: 29,
      isVisible: true,
    },
    {
      universalIdentifier: 'f31e6e68-4a92-4fac-b543-a58f24fbd763',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoDescription,
      position: 30,
      isVisible: true,
    },
    {
      universalIdentifier: '5adf5b23-33f3-484e-ad28-4a0dc0be0519',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoSicCodes,
      position: 31,
      isVisible: true,
    },
    {
      universalIdentifier: 'f36e85da-30a5-4666-8db7-cb840f897f59',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoNaicsCodes,
      position: 32,
      isVisible: true,
    },
    {
      universalIdentifier: '99daf97e-fa53-4de8-8391-3c6937e8c39f',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoCompetitors,
      position: 33,
      isVisible: true,
    },
    {
      universalIdentifier: 'cf2fa4d9-aaa1-43ed-aadc-ccdb235dcf64',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoEmployeeGrowth,
      position: 34,
      isVisible: true,
    },
    {
      universalIdentifier: 'ce53e9c8-a739-40d7-8a00-b97ee1dd8607',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoEmployeeCountByDepartment,
      position: 35,
      isVisible: true,
    },
    {
      universalIdentifier: '3e6413b2-4f3d-43b5-b340-b6c21261b395',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoCompanyId,
      position: 36,
      isVisible: true,
    },
    {
      universalIdentifier: '7d49679a-5bc0-481d-95e3-9c4b443bc3f7',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoUltimateParentId,
      position: 37,
      isVisible: true,
    },
    {
      universalIdentifier: 'f0d2b411-6e55-490b-bf40-1bfd8e9e5c2c',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.company.zoomInfoRawPayload,
      position: 38,
      isVisible: true,
    },
  ],
});
