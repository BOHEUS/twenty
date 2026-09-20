import { isDefined } from 'src/logic-functions/utils/is-defined';
import { type RevealSettings } from 'src/types/reveal-settings';
import { type RocketReachPersonLookupParams } from 'src/types/rocketreach-person-lookup-params';

export const toLookupQueryParams = ({
  params,
  revealSettings,
}: {
  params: RocketReachPersonLookupParams;
  revealSettings: RevealSettings;
}): Record<string, string> => {
  const queryParams: Record<string, string> = {
    reveal_professional_email: String(revealSettings.professionalEmail),
    reveal_personal_email: String(revealSettings.personalEmail),
    reveal_phone: String(revealSettings.phone),
    reveal_detailed_person_enrichment: String(
      revealSettings.detailedPersonEnrichment,
    ),
    reveal_healthcare_enrichment: String(revealSettings.healthcareEnrichment),
  };

  if (isDefined(params.profileId)) {
    queryParams.id = String(params.profileId);

    return queryParams;
  }

  if (isDefined(params.linkedinUrl)) {
    queryParams.linkedin_url = params.linkedinUrl;
  }

  if (isDefined(params.email)) {
    queryParams.email = params.email;
  }

  // RocketReach only accepts a name when it is paired with an employer.
  if (isDefined(params.name) && isDefined(params.currentEmployer)) {
    queryParams.name = params.name;
    queryParams.current_employer = params.currentEmployer;

    if (isDefined(params.title)) {
      queryParams.title = params.title;
    }
  }

  return queryParams;
};
