import { CRUSTDATA_PERSON_ENRICH_PATH } from 'src/constants/crustdata-api';
import { PERSON_ENRICH_FIELDS } from 'src/constants/person-enrich-fields';
import { dedupeIdentifiers } from 'src/logic-functions/utils/dedupe-identifiers';
import { enrichIdentifiers } from 'src/logic-functions/utils/enrich-identifiers';
import { postContactEnrich } from 'src/logic-functions/utils/post-contact-enrich';
import { type CrustdataEnrichResult } from 'src/types/crustdata-enrich-result';
import { type CrustdataPersonData } from 'src/types/crustdata-person-data';
import { type PersonEnrichParams } from 'src/types/person-enrich-params';
import { isDefined } from 'src/utils/is-defined';

export type PersonEnrichBatchResult = {
  results: CrustdataEnrichResult<CrustdataPersonData>[];
  creditsUsed: number;
};

const MISSING_RESULT: CrustdataEnrichResult<CrustdataPersonData> = {
  outcome: 'error',
  httpStatus: 0,
  message: 'Crustdata returned no result for this person.',
};

export const enrichPeople = async (
  params: PersonEnrichParams[],
): Promise<PersonEnrichBatchResult> => {
  const profileUrls = dedupeIdentifiers(
    params
      .filter((entry) => entry.matchOn === 'profileUrl')
      .map((entry) => entry.profileUrl),
  );
  const businessEmails = dedupeIdentifiers(
    params
      .filter((entry) => entry.matchOn === 'businessEmail')
      .map((entry) => entry.businessEmail),
  );
  const shouldEnrichProfileContacts = params.some(
    (entry) => entry.matchOn === 'profileUrl' && entry.enrichContactData,
  );

  const [profiles, profileContacts, emailContacts] = await Promise.all([
    enrichIdentifiers<CrustdataPersonData>({
      path: CRUSTDATA_PERSON_ENRICH_PATH,
      body: {
        professional_network_profile_urls: profileUrls,
        fields: [...PERSON_ENRICH_FIELDS],
      },
      identifiers: profileUrls,
      dataKey: 'person_data',
    }),
    postContactEnrich({
      identifierType: 'professional_network_profile_urls',
      identifiers: shouldEnrichProfileContacts ? profileUrls : [],
    }),
    postContactEnrich({
      identifierType: 'business_emails',
      identifiers: businessEmails,
    }),
  ]);

  const results = params.map(
    (entry): CrustdataEnrichResult<CrustdataPersonData> => {
      if (entry.matchOn === 'businessEmail') {
        const personData = emailContacts.personDataByIdentifier.get(
          entry.businessEmail.toLowerCase(),
        );

        return isDefined(personData)
          ? { outcome: 'matched', httpStatus: 200, data: personData }
          : { outcome: 'not_found', httpStatus: 200 };
      }

      const profileResult =
        profiles.resultByIdentifier.get(entry.profileUrl.toLowerCase()) ??
        MISSING_RESULT;

      if (profileResult.outcome !== 'matched') {
        return profileResult;
      }

      const contact = profileContacts.personDataByIdentifier.get(
        entry.profileUrl.toLowerCase(),
      )?.contact;

      return isDefined(contact)
        ? { ...profileResult, data: { ...profileResult.data, contact } }
        : profileResult;
    },
  );

  return {
    results,
    creditsUsed:
      profiles.creditsUsed +
      profileContacts.creditsUsed +
      emailContacts.creditsUsed,
  };
};
