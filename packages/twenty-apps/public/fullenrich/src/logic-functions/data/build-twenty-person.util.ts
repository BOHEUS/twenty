import { isNonEmptyString } from '@sniptt/guards';

import { buildTwentyEmails } from 'src/logic-functions/data/build-twenty-emails.util';
import { buildTwentyPhones } from 'src/logic-functions/data/build-twenty-phones.util';
import { matchSelectValue } from 'src/logic-functions/data/match-select-value.util';
import {
  type FullEnrichContactInfo,
  type FullEnrichProfile,
} from 'src/logic-functions/types/fullenrich.types';
import { SENIORITIES, type TwentyPersonUpdate } from 'src/logic-functions/types/twenty.types';
import { isDefined } from 'src/logic-functions/utils/is-defined';

// Every field is written conditionally: the person record already holds data and
// a missing FullEnrich value must not overwrite it with an empty one
export const buildTwentyPerson = ({
  profile,
  contactInfo,
  enrichedAt,
}: {
  profile?: FullEnrichProfile;
  contactInfo?: FullEnrichContactInfo;
  enrichedAt: string;
}): TwentyPersonUpdate => {
  const currentPosition = profile?.employment?.current;
  const professionalNetwork = profile?.social_profiles?.professional_network;
  const location = profile?.location;
  const jobFunction = currentPosition?.job_functions?.[0];
  const seniority = matchSelectValue(currentPosition?.seniority, SENIORITIES);
  const emails = isDefined(contactInfo)
    ? buildTwentyEmails(contactInfo)
    : undefined;
  const phones = isDefined(contactInfo)
    ? buildTwentyPhones(contactInfo)
    : undefined;
  const hasLocation =
    isNonEmptyString(location?.city) ||
    isNonEmptyString(location?.region) ||
    isNonEmptyString(location?.country);

  return {
    fullEnrichEnrichedAt: enrichedAt,
    ...(isDefined(emails) && { emails }),
    ...(isDefined(phones) && { phones }),
    ...(isNonEmptyString(profile?.first_name) &&
      isNonEmptyString(profile?.last_name) && {
        name: { firstName: profile.first_name, lastName: profile.last_name },
      }),
    ...(isNonEmptyString(profile?.id) && {
      fullEnrichPersonId: profile.id,
    }),
    ...(isNonEmptyString(profile?.headline) && {
      fullEnrichHeadline: profile.headline,
    }),
    ...(isNonEmptyString(profile?.description) && {
      fullEnrichAbout: profile.description,
    }),
    ...(!!profile?.skills?.length && { fullEnrichSkills: profile.skills }),
    ...(!!profile?.languages?.length && {
      fullEnrichLanguages: profile.languages,
    }),
    ...(!!profile?.educations?.length && {
      fullEnrichEducations: profile.educations,
    }),
    ...(isNonEmptyString(professionalNetwork?.url) && {
      linkedinLink: {
        primaryLinkLabel: professionalNetwork?.handle ?? '',
        primaryLinkUrl: professionalNetwork.url,
      },
    }),
    ...(!!professionalNetwork?.connection_count && {
      fullEnrichLinkedinConnectionCount: professionalNetwork.connection_count,
    }),
    ...(hasLocation && {
      fullEnrichLocation: {
        // FullEnrich reports a person's location as city, region and country only
        addressStreet1: '',
        addressStreet2: '',
        addressCity: location?.city ?? '',
        addressState: location?.region ?? '',
        addressPostcode: '',
        addressCountry: location?.country ?? '',
      },
    }),
    ...(isNonEmptyString(currentPosition?.title) && {
      jobTitle: currentPosition.title,
    }),
    ...(isNonEmptyString(currentPosition?.start_at) && {
      fullEnrichCurrentRoleStartedAt: currentPosition.start_at,
    }),
    ...(isDefined(seniority) && { fullEnrichSeniority: seniority }),
    ...(isNonEmptyString(jobFunction?.function) && {
      fullEnrichJobFunction: jobFunction.function,
    }),
    ...(isNonEmptyString(jobFunction?.sub_function) && {
      fullEnrichJobSubFunction: jobFunction.sub_function,
    }),
    ...(!!profile?.employment?.all?.length && {
      fullEnrichEmploymentHistory: profile.employment.all,
    }),
  };
};
