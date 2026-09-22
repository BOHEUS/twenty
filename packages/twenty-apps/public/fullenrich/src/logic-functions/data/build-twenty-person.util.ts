import {
  ContactInfo,
  fullEnrichTwentyPerson,
  Profile,
  TWENTY_SENIORITIES,
} from "src/logic-functions/shared/types";
import { buildTwentyEmails } from "src/logic-functions/data/build-twenty-emails.util";
import { buildTwentyPhones } from "src/logic-functions/data/build-twenty-phones.util";
import { matchSelectValue } from "src/logic-functions/data/match-select-value.util";

type BuildTwentyPersonArgs = {
  profile?: Profile;
  contactInfo?: ContactInfo;
  companyId: string;
  enrichedAt: string;
};

// Every field is written conditionally: the person record already holds data and
// a missing FullEnrich value must not overwrite it with an empty one
export const buildTwentyPerson = ({
  profile,
  contactInfo,
  companyId,
  enrichedAt,
}: BuildTwentyPersonArgs): fullEnrichTwentyPerson => {
  const currentPosition = profile?.employment?.current;
  const professionalNetwork = profile?.social_profiles?.professional_network;
  const location = profile?.location;
  const jobFunction = currentPosition?.job_functions?.[0];
  const seniority = matchSelectValue(currentPosition?.seniority, TWENTY_SENIORITIES);

  return {
    companyId,
    enrichedAt,
    ...(contactInfo && {
      emails: buildTwentyEmails(contactInfo),
      phones: buildTwentyPhones(contactInfo),
    }),
    ...(profile && {
      name: { firstName: profile.first_name, lastName: profile.last_name },
      fullEnrichPersonId: profile.id,
      ...(profile.headline && { headline: profile.headline }),
      ...(profile.description && { about: profile.description }),
      ...(profile.skills?.length && { skills: profile.skills }),
      ...(profile.languages?.length && { languages: profile.languages }),
      ...(profile.educations?.length && { educations: profile.educations }),
    }),
    ...(professionalNetwork?.url && {
      linkedinLink: {
        primaryLinkLabel: professionalNetwork.handle ?? '',
        primaryLinkUrl: professionalNetwork.url,
      },
    }),
    ...(professionalNetwork?.connection_count && {
      linkedinConnectionCount: professionalNetwork.connection_count,
    }),
    ...(location && {
      location: {
        addressStreet1: '',
        addressStreet2: '',
        addressCity: location.city ?? '',
        addressCountry: location.country ?? '',
        addressState: location.region ?? '',
        addressZipCode: '',
      },
    }),
    ...(currentPosition?.title && { jobTitle: currentPosition.title }),
    ...(currentPosition?.start_at && {
      currentRoleStartedAt: currentPosition.start_at,
    }),
    ...(seniority && { seniority }),
    ...(jobFunction?.function && { jobFunction: jobFunction.function }),
    ...(jobFunction?.sub_function && {
      jobSubFunction: jobFunction.sub_function,
    }),
    ...(profile?.employment?.all?.length && {
      employmentHistory: profile.employment.all,
    }),
  };
};
