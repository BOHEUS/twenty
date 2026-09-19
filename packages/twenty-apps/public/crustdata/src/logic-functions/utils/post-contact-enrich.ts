import { CONTACT_ENRICH_FIELDS } from 'src/constants/contact-enrich-fields';
import { CRUSTDATA_CONTACT_ENRICH_PATH } from 'src/constants/crustdata-api';
import { enrichIdentifiers } from 'src/logic-functions/utils/enrich-identifiers';
import { type CrustdataPersonData } from 'src/types/crustdata-person-data';
import { isDefined } from 'src/utils/is-defined';

export type ContactEnrichBatch = {
  // Keyed by the lowercased identifier, as enrichIdentifiers returns it.
  personDataByIdentifier: Map<string, CrustdataPersonData>;
  creditsUsed: number;
};

// Contact enrichment is a separate billed endpoint that Crustdata gates to Enterprise plans. A
// failure here is reported and dropped rather than raised, so it never sinks profile data the
// first call already paid for.
export const postContactEnrich = async ({
  identifierType,
  identifiers,
}: {
  identifierType: 'professional_network_profile_urls' | 'business_emails';
  identifiers: string[];
}): Promise<ContactEnrichBatch> => {
  const { resultByIdentifier, creditsUsed } =
    await enrichIdentifiers<CrustdataPersonData>({
      path: CRUSTDATA_CONTACT_ENRICH_PATH,
      body: {
        [identifierType]: identifiers,
        fields: [...CONTACT_ENRICH_FIELDS],
      },
      identifiers,
      dataKey: 'person_data',
    });

  const personDataByIdentifier = new Map<string, CrustdataPersonData>();

  for (const [identifier, result] of resultByIdentifier) {
    if (result.outcome === 'matched') {
      personDataByIdentifier.set(identifier, result.data);
    }
  }

  const failure = Array.from(resultByIdentifier.values()).find(
    (result) => result.outcome === 'error',
  );

  if (isDefined(failure) && failure.outcome === 'error') {
    console.warn(`[crustdata] Contact enrichment skipped: ${failure.message}`);
  }

  return { personDataByIdentifier, creditsUsed };
};
