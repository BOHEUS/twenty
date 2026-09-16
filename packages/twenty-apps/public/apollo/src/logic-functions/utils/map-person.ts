import { APOLLO_MATCH_CONFIDENCE_VALUES } from 'src/constants/match-confidence-options.constant';
import { APOLLO_SENIORITY_VALUES } from 'src/constants/seniority-options.constant';
import { type ApolloRecord } from 'src/logic-functions/types/apollo-record.type';
import { buildAddress } from '../data/build-address';
import { buildLinks } from '../data/build-links';
import { isDefined } from '../data/is-defined';
import { pickSelectValue } from '../data/pick-select-value';
import { pruneUndefined } from '../data/prune-undefined';
import { toBoolean } from '../data/to-boolean';
import { toJsonArray, toJsonObject } from '../data/to-json';
import { toNumber } from '../data/to-number';
import { toStringArray } from '../data/to-string-array';
import { toText } from '../data/to-text';

const readPhoneNumbers = (person: ApolloRecord): unknown[] | undefined =>
  toJsonArray(person.phone_numbers) ??
  toJsonArray(toJsonObject(person.contact)?.phone_numbers);

const buildFullName = (person: ApolloRecord) => {
  const firstName = toText(person.first_name);
  const lastName = toText(person.last_name);

  if (!isDefined(firstName) && !isDefined(lastName)) {
    return undefined;
  }

  return { firstName: firstName ?? '', lastName: lastName ?? '' };
};

const buildPhones = (person: ApolloRecord) => {
  const firstPhone = toJsonObject(readPhoneNumbers(person)?.[0]);
  const number =
    toText(firstPhone?.sanitized_number) ?? toText(firstPhone?.raw_number);

  return isDefined(number) ? { primaryPhoneNumber: number } : undefined;
};

export const buildPersonStandardData = (
  person: ApolloRecord,
): Record<string, unknown> => {
  const email = toText(person.email);

  return pruneUndefined({
    name: buildFullName(person),
    emails: isDefined(email) ? { primaryEmail: email } : undefined,
    jobTitle: toText(person.title),
    linkedinLink: buildLinks(person.linkedin_url, 'LinkedIn'),
    phones: buildPhones(person),
  });
};

export const buildPersonApolloData = ({
  person,
  enrichedAt,
}: {
  person: ApolloRecord;
  enrichedAt: string;
}): Record<string, unknown> =>
  pruneUndefined({
    apolloId: toText(person.id),
    apolloHeadline: toText(person.headline),
    apolloXLink: buildLinks(person.twitter_url, 'X'),
    apolloGithubLink: buildLinks(person.github_url, 'GitHub'),
    apolloFacebookLink: buildLinks(person.facebook_url, 'Facebook'),
    apolloPhotoLink: buildLinks(person.photo_url, 'Photo'),
    apolloLocation: buildAddress({
      city: person.city,
      state: person.state,
      country: person.country,
    }),
    apolloSeniority: pickSelectValue({
      raw: person.seniority,
      allowedValues: APOLLO_SENIORITY_VALUES,
    }),
    apolloDepartments: toStringArray(person.departments),
    apolloSubdepartments: toStringArray(person.subdepartments),
    apolloFunctions: toStringArray(person.functions),
    apolloEmailStatus: toText(person.email_status),
    apolloEmailConfidence: toNumber(person.extrapolated_email_confidence),
    apolloPersonalEmails: toStringArray(person.personal_emails),
    apolloPhoneNumbers: readPhoneNumbers(person),
    apolloEmploymentHistory: toJsonArray(person.employment_history),
    apolloMatchConfidence: pickSelectValue({
      raw: person.match_confidence,
      allowedValues: APOLLO_MATCH_CONFIDENCE_VALUES,
    }),
    apolloIsLikelyToEngage: toBoolean(person.is_likely_to_engage),
    apolloShowIntent: toBoolean(person.show_intent),
    apolloRevealedForCurrentTeam: toBoolean(person.revealed_for_current_team),
    apolloContactId: toText(person.contact_id),
    apolloAccountId: toText(person.account_id),
    apolloOrganizationId: toText(person.organization_id),
    apolloLastEnrichedAt: enrichedAt,
    apolloEnrichmentStatus: 'ENRICHED',
    apolloRawPayload: person,
  });
