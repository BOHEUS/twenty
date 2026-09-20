import {
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
  defineView,
} from 'twenty-sdk/define';

import {
  ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS,
  ROCKETREACH_VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: ROCKETREACH_VIEW_UNIVERSAL_IDENTIFIERS.enrichedCompanies,
  name: 'Enriched (RocketReach)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    { universalIdentifier: '0d5cf76b-46ba-4d06-b28e-3a9244fc7163', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.name.universalIdentifier, position: 0, isVisible: true },
    { universalIdentifier: '20a6b5e9-a970-460a-b1fb-7bb1fba09351', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.domainName.universalIdentifier, position: 1, isVisible: true },
    { universalIdentifier: 'ca0c0732-eaf7-496d-a31b-96798d2423f5', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.linkedinLink.universalIdentifier, position: 2, isVisible: true },
    { universalIdentifier: 'eb3fdb1a-45db-4c24-8caf-d67d4d2c3996', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.address.universalIdentifier, position: 3, isVisible: true },
    { universalIdentifier: 'fff1d22a-0456-4cb9-8e92-0eb4760136c7', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.annualRevenue.universalIdentifier, position: 4, isVisible: true },
    { universalIdentifier: '146ecadb-dad5-4862-b847-b429e0696fbb', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachIndustry, position: 5, isVisible: true },
    { universalIdentifier: '3473b021-9a30-40c9-af7e-23c5b60ac6c5', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachEmployeeCount, position: 6, isVisible: true },
    { universalIdentifier: '17efa90d-22e4-40e3-bbde-917a6041119e', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachFoundedYear, position: 7, isVisible: true },
    { universalIdentifier: 'd6c523a9-3424-4438-a9df-4972fa7e7b6b', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachDescription, position: 8, isVisible: true },
    { universalIdentifier: '63774b4a-097d-41fe-bf43-1bd9a02960dd', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachTickerSymbol, position: 9, isVisible: true },
    { universalIdentifier: '60e394cc-23ee-4ab1-beaf-7ae77d6a13a7', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachPhone, position: 10, isVisible: true },
    { universalIdentifier: 'a3bacc7f-ec2b-4ecb-9800-fc4dcf7c742a', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachTechstack, position: 11, isVisible: true },
    { universalIdentifier: '2727179d-c241-4fc5-a68f-4e9b7e275c66', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachIndustries, position: 12, isVisible: true },
    { universalIdentifier: '4e007ca2-0535-40c2-8d55-4b8d97755a0d', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachIndustryKeywords, position: 13, isVisible: true },
    { universalIdentifier: '0db61433-6f50-4a6b-9bcd-75934a34bba0', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachSicCodes, position: 14, isVisible: true },
    { universalIdentifier: 'a9691144-c6d2-4362-ae90-bb0660b531ef', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachNaicsCodes, position: 15, isVisible: true },
    { universalIdentifier: '7a1da7c3-fde2-4356-a564-6b8e98cd01a4', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachFundingInvestors, position: 16, isVisible: true },
    { universalIdentifier: 'aadfe241-54a0-4001-a6ae-b247d49999eb', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachCompetitors, position: 17, isVisible: true },
    { universalIdentifier: '0e35ea67-5b92-43ec-b434-a3bf6e4cfeaf', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachDepartmentHeadcount, position: 18, isVisible: true },
    { universalIdentifier: 'e9907986-f45e-4d08-8fd2-54bf0b3f54d2', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachCompanyGrowth, position: 19, isVisible: true },
    { universalIdentifier: '7428ed78-adf2-4111-9e9a-40946e81d759', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachEmailDomain, position: 20, isVisible: true },
    { universalIdentifier: '48afc7df-fed2-42f7-9c4f-f9273cf02952', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachFax, position: 21, isVisible: true },
    { universalIdentifier: 'a1a96ea2-aeee-4837-9cd1-f4a763d23a59', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachTwitterLink, position: 22, isVisible: true },
    { universalIdentifier: '5002bd14-f5f5-469e-92ab-0d7cb194f473', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachFacebookLink, position: 23, isVisible: true },
    { universalIdentifier: '528edb03-2aa7-4a59-a83d-c2f9695e6655', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachProfileLink, position: 24, isVisible: true },
    { universalIdentifier: '41d33e5b-80d7-4a59-ad40-5fb44c328e5b', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachEnrichmentStatus, position: 25, isVisible: true },
    { universalIdentifier: '79ad9583-b188-4585-be02-b83711d4592b', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachLastEnrichedAt, position: 26, isVisible: true },
    { universalIdentifier: '0abf3b0b-f525-4ebb-b9b9-6aea5a1ce138', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachId, position: 27, isVisible: true },
    { universalIdentifier: '1295f21f-bc77-4bb6-a369-92452a51043e', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company.rocketReachRawPayload, position: 28, isVisible: true },
  ],
});
