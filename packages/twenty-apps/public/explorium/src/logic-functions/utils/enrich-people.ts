import { enrichExploriumEntities } from 'src/logic-functions/utils/enrich-explorium-entities';
import { matchExploriumEntities } from 'src/logic-functions/utils/match-explorium-entities';
import { resolveContactTypes } from 'src/logic-functions/utils/resolve-contact-types';
import { resolveExploriumIds } from 'src/logic-functions/utils/resolve-explorium-ids';
import { type ExploriumEnrichResult } from 'src/types/explorium-enrich-result';
import { type ExploriumProspectMatchInput } from 'src/types/explorium-match-inputs';
import { type ExploriumMatchParams } from 'src/types/explorium-match-params';
import { type ExploriumPersonData } from 'src/types/explorium-person-data';
import { isDefined } from 'src/utils/is-defined';

const RESOURCE_CONTEXT = 'explorium/person';

export const enrichPeople = async (
  params: ExploriumMatchParams<ExploriumProspectMatchInput>[],
): Promise<ExploriumEnrichResult<ExploriumPersonData>[]> => {
  const matchResults = await resolveExploriumIds({
    params,
    match: (matchInputs) =>
      matchExploriumEntities({
        path: '/prospects/match',
        inputsKey: 'prospects_to_match',
        matchesKey: 'matched_prospects',
        idKey: 'prospect_id',
        inputs: matchInputs,
        resourceContext: RESOURCE_CONTEXT,
      }),
  });

  const prospectIds = Array.from(
    new Set(
      matchResults.flatMap((matchResult) =>
        matchResult.outcome === 'matched' ? [matchResult.id] : [],
      ),
    ),
  );

  const profiles = await enrichExploriumEntities({
    path: '/prospects/profiles/enrich',
    idsKey: 'prospect_ids',
    idKey: 'prospect_id',
    ids: prospectIds,
    resourceContext: RESOURCE_CONTEXT,
  });

  const contactTypes = resolveContactTypes();
  const contacts =
    contactTypes.length > 0
      ? await enrichExploriumEntities({
          path: '/prospects/contact_information/enrich',
          idsKey: 'prospect_ids',
          idKey: 'prospect_id',
          ids: prospectIds,
          parameters: { contact_types: contactTypes },
          resourceContext: RESOURCE_CONTEXT,
        })
      : undefined;

  return matchResults.map(
    (matchResult): ExploriumEnrichResult<ExploriumPersonData> => {
      if (matchResult.outcome !== 'matched') {
        return matchResult;
      }

      if (!profiles.ok) {
        return {
          outcome: 'error',
          httpStatus: profiles.httpStatus,
          message: profiles.message,
        };
      }

      if (isDefined(contacts) && !contacts.ok) {
        return {
          outcome: 'error',
          httpStatus: contacts.httpStatus,
          message: contacts.message,
        };
      }

      const profile = profiles.dataById.get(matchResult.id);
      const contactInformation = contacts?.dataById.get(matchResult.id);

      if (!isDefined(profile) && !isDefined(contactInformation)) {
        return { outcome: 'not_found' };
      }

      return {
        outcome: 'matched',
        data: {
          ...profile,
          ...contactInformation,
          prospect_id: matchResult.id,
        } as ExploriumPersonData,
      };
    },
  );
};
