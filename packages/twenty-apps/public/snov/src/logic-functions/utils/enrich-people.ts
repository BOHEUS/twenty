import { SNOV_TIME_LIMIT_MESSAGE } from 'src/constants/snov-time-limit-message';
import { chargeSnovCredits } from 'src/logic-functions/utils/charge-snov-credits';
import { countEmailFinderCredits } from 'src/logic-functions/utils/count-email-finder-credits';
import { fetchSnovLinkedinProfiles } from 'src/logic-functions/utils/fetch-snov-linkedin-profiles';
import { fetchSnovProfileByEmail } from 'src/logic-functions/utils/fetch-snov-profile-by-email';
import { findSnovEmailsByName } from 'src/logic-functions/utils/find-snov-emails-by-name';
import { getSnovCreditCostDollars } from 'src/logic-functions/utils/get-snov-credit-cost-dollars';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { pickFoundEmail } from 'src/logic-functions/utils/pick-found-email';
import { readFindMissingEmailsSetting } from 'src/logic-functions/utils/read-find-missing-emails-setting';
import { type SnovEnrichResult } from 'src/types/snov-enrich-result';
import { type SnovPersonData } from 'src/types/snov-person-data';
import { type SnovPersonMatchParams } from 'src/types/snov-person-match-params';
import { isDefined } from 'src/utils/is-defined';

type PersonEnrichResult = SnovEnrichResult<SnovPersonData>;

type PersonLookup = {
  data: SnovPersonData;
  credits: number;
  error?: { httpStatus: number; message: string };
};

const RESOURCE_CONTEXT = 'snov/person';

const lookUpProfilesByEmail = async ({
  lookups,
  emailByIndex,
  deadline,
}: {
  lookups: PersonLookup[];
  emailByIndex: Map<number, string>;
  deadline: number;
}): Promise<void> => {
  for (const [index, email] of emailByIndex) {
    if (Date.now() > deadline) {
      lookups[index].error = TIME_LIMIT_ERROR;
      continue;
    }

    const profileResult = await fetchSnovProfileByEmail(email);

    if (!profileResult.ok) {
      lookups[index].error = profileResult;
      continue;
    }

    if (isDefined(profileResult.profile)) {
      lookups[index].data.emailProfile = profileResult.profile;
      // Snov.io charges for a profile lookup only when it finds the owner
      lookups[index].credits += 1;
    }
  }
};

const TIME_LIMIT_ERROR = { httpStatus: 0, message: SNOV_TIME_LIMIT_MESSAGE };

const toPersonEnrichResult = (lookup: PersonLookup): PersonEnrichResult => {
  if (isDefined(lookup.error)) {
    return {
      outcome: 'error',
      httpStatus: lookup.error.httpStatus,
      message: lookup.error.message,
    };
  }

  const { email, emailProfile, linkedinProfile } = lookup.data;

  return isDefined(email) ||
    isDefined(emailProfile) ||
    isDefined(linkedinProfile)
    ? { outcome: 'matched', data: lookup.data }
    : { outcome: 'not_found' };
};

export const enrichPeople = async (
  params: SnovPersonMatchParams[],
  { deadline }: { deadline: number },
): Promise<PersonEnrichResult[]> => {
  const creditCostDollars = getSnovCreditCostDollars();
  const shouldFindMissingEmails = readFindMissingEmailsSetting();
  const lookups: PersonLookup[] = params.map(() => ({ data: {}, credits: 0 }));

  const finderIndexes: number[] = [];
  const linkedinIndexes: number[] = [];
  const emailByIndex = new Map<number, string>();

  params.forEach((entry, index) => {
    if (isDefined(entry.email)) {
      emailByIndex.set(index, entry.email);
    } else if (
      shouldFindMissingEmails &&
      isDefined(entry.firstName) &&
      isDefined(entry.lastName) &&
      isDefined(entry.domain)
    ) {
      finderIndexes.push(index);
    } else if (isDefined(entry.linkedinUrl)) {
      linkedinIndexes.push(index);
    }
  });

  if (finderIndexes.length > 0 && Date.now() > deadline) {
    finderIndexes.forEach((index) => {
      lookups[index].error = TIME_LIMIT_ERROR;
    });
  } else if (finderIndexes.length > 0) {
    const finderResult = await findSnovEmailsByName({
      rows: finderIndexes.map((index) => ({
        firstName: params[index].firstName ?? '',
        lastName: params[index].lastName ?? '',
        domain: params[index].domain ?? '',
      })),
      deadline,
    });

    finderIndexes.forEach((index, rowIndex) => {
      if (!finderResult.ok) {
        lookups[index].error = finderResult;

        return;
      }

      const emailChecks = finderResult.emailChecksByRow[rowIndex] ?? [];
      const foundEmail = pickFoundEmail(emailChecks);

      lookups[index].credits += countEmailFinderCredits(emailChecks);

      if (isDefined(foundEmail?.email)) {
        lookups[index].data.email = foundEmail.email;
        lookups[index].data.emailCheck = foundEmail;
        emailByIndex.set(index, foundEmail.email);
      } else if (isDefined(params[index].linkedinUrl)) {
        linkedinIndexes.push(index);
      }
    });
  }

  await lookUpProfilesByEmail({ lookups, emailByIndex, deadline });

  for (const index of emailByIndex.keys()) {
    const lookup = lookups[index];

    if (
      !isDefined(lookup.error) &&
      !isDefined(lookup.data.emailProfile) &&
      isDefined(params[index].linkedinUrl) &&
      !linkedinIndexes.includes(index)
    ) {
      linkedinIndexes.push(index);
    }
  }

  if (linkedinIndexes.length > 0 && Date.now() > deadline) {
    linkedinIndexes.forEach((index) => {
      lookups[index].error = TIME_LIMIT_ERROR;
    });
  } else if (linkedinIndexes.length > 0) {
    const linkedinResult = await fetchSnovLinkedinProfiles({
      urls: linkedinIndexes.map((index) => params[index].linkedinUrl ?? ''),
      deadline,
    });

    for (const index of linkedinIndexes) {
      if (!linkedinResult.ok) {
        lookups[index].error = linkedinResult;
        continue;
      }

      const linkedinProfile = linkedinResult.profileByUrl.get(
        normalizeLinkedinUrl(params[index].linkedinUrl) ?? '',
      );

      if (isDefined(linkedinProfile)) {
        lookups[index].data.linkedinProfile = linkedinProfile;
        // One credit for each LinkedIn profile returned
        lookups[index].credits += 1;
      }
    }
  }

  await chargeSnovCredits({
    snovCredits: lookups.reduce((total, lookup) => total + lookup.credits, 0),
    creditCostDollars,
    resourceContext: RESOURCE_CONTEXT,
  });

  return lookups.map(toPersonEnrichResult);
};
