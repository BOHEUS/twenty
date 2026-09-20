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
  universalIdentifier: ROCKETREACH_VIEW_UNIVERSAL_IDENTIFIERS.enrichedPeople,
  name: 'Enriched (RocketReach)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    { universalIdentifier: 'bf1cdef7-5fbe-4989-b343-5c74c6fde396', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.name.universalIdentifier, position: 0, isVisible: true },
    { universalIdentifier: '3cc70322-f80a-433f-9302-eb08c98b8628', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.jobTitle.universalIdentifier, position: 1, isVisible: true },
    { universalIdentifier: '10f0018f-229a-4a7f-81f0-374ea87f7fcc', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.company.universalIdentifier, position: 2, isVisible: true },
    { universalIdentifier: '7ae47bf3-ea81-4170-bf2d-96217545efeb', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.emails.universalIdentifier, position: 3, isVisible: true },
    { universalIdentifier: 'fd2632be-8e87-4bfe-9198-7661a6c82e1a', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.phones.universalIdentifier, position: 4, isVisible: true },
    { universalIdentifier: '281113ac-0bd2-4dbb-93aa-81aab289f707', fieldMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.linkedinLink.universalIdentifier, position: 5, isVisible: true },
    { universalIdentifier: 'dd188281-c910-4126-aba2-cd5ebf5a54f3', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachSeniority, position: 6, isVisible: true },
    { universalIdentifier: '473242a3-e54e-44b8-923e-71d219ceccbc', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachDepartment, position: 7, isVisible: true },
    { universalIdentifier: '011b3f84-6025-4d4b-9496-1227a23e4405', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachSubDepartment, position: 8, isVisible: true },
    { universalIdentifier: 'b1c85cbf-acd9-422e-9dd8-33820152d50d', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachLocation, position: 9, isVisible: true },
    { universalIdentifier: '30979ad2-f3b3-4559-8596-2594d69d087a', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachSkills, position: 10, isVisible: true },
    { universalIdentifier: '90994730-b9d5-4981-a3c0-1d1c56df1391', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachLinkedinConnections, position: 11, isVisible: true },
    { universalIdentifier: 'a366adf1-04bb-41f9-8356-bf639bc5ed8d', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachLinkedinActive, position: 12, isVisible: true },
    { universalIdentifier: '4c0015dd-9f73-435b-a97f-bc8211a6d287', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachPersonalEmail, position: 13, isVisible: true },
    { universalIdentifier: '95e246bd-d807-4ad5-b8c6-0600b401cc9f', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachBirthYear, position: 14, isVisible: true },
    { universalIdentifier: '99286988-ca9d-4a3b-a7fd-0af407fb4c65', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachEnrichmentStatus, position: 15, isVisible: true },
    { universalIdentifier: 'a6947e6a-3fe5-4e32-aec8-acf480e62696', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachLastEnrichedAt, position: 16, isVisible: true },
    { universalIdentifier: 'a3d740ab-6bd8-4eb8-99a2-5395b7f50a91', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachId, position: 17, isVisible: true },
    { universalIdentifier: '8dfc3cf9-2507-4ea4-b215-5877f3e88082', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachJobHistory, position: 18, isVisible: true },
    { universalIdentifier: '8df12080-b422-4e02-b931-07ca5daa2ac2', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachEducation, position: 19, isVisible: true },
    { universalIdentifier: '2712813a-f7f9-418e-8d62-16e94019a22d', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachLinks, position: 20, isVisible: true },
    { universalIdentifier: '2e3f3933-ecdb-4959-b91b-d86cc91ed733', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachEmailDetails, position: 21, isVisible: true },
    { universalIdentifier: '547aa39f-bab9-4766-9138-920850d7e286', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachPhoneDetails, position: 22, isVisible: true },
    { universalIdentifier: '44cf7d4b-c814-4542-af04-12f339228132', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachNpiData, position: 23, isVisible: true },
    { universalIdentifier: '67136bc2-65b0-4e2b-96bc-ffba996f022a', fieldMetadataUniversalIdentifier: ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person.rocketReachRawPayload, position: 24, isVisible: true },
  ],
});
