import { isNonEmptyString } from '@sniptt/guards';

import {
  HUNTER_EMAIL_FINDER_CREDITS,
  HUNTER_ENRICHMENT_CREDITS,
} from 'src/constants/hunter-credit-costs';
import { callHunter } from 'src/logic-functions/utils/call-hunter';
import { hasCoreCompanyData } from 'src/logic-functions/utils/has-core-company-data';
import { hasCorePersonData } from 'src/logic-functions/utils/has-core-person-data';
import { type HunterCompany } from 'src/types/hunter-company';
import { type HunterEmailFinderResult } from 'src/types/hunter-email-finder-result';
import { type HunterEnrichResult } from 'src/types/hunter-enrich-result';
import { type HunterPerson } from 'src/types/hunter-person';
import { type HunterPersonData } from 'src/types/hunter-person-data';
import { type HunterPersonMatchParams } from 'src/types/hunter-person-match-params';
import { isDefined } from 'src/utils/is-defined';
import { isRecord } from 'src/utils/is-record';
import { pruneUndefined } from 'src/utils/prune-undefined';

export type HunterUsage = { credits: number; billedCalls: number };

const canFindEmail = (params: HunterPersonMatchParams): boolean =>
  isDefined(params.linkedinHandle) ||
  (isDefined(params.firstName) &&
    isDefined(params.lastName) &&
    (isDefined(params.domain) || isDefined(params.companyName)));

const toEmailFinderQuery = (params: HunterPersonMatchParams) =>
  pruneUndefined({
    domain: params.domain,
    company: isDefined(params.domain) ? undefined : params.companyName,
    first_name: params.firstName,
    last_name: params.lastName,
    linkedin_handle: params.linkedinHandle,
  });

// The response bodies are untyped JSON; fields are read defensively by the mappers
export const lookupHunterPerson = async ({
  params,
  shouldFindMissingEmails,
  usage,
}: {
  params: HunterPersonMatchParams;
  shouldFindMissingEmails: boolean;
  usage: HunterUsage;
}): Promise<HunterEnrichResult<HunterPersonData>> => {
  const data: HunterPersonData = {};
  let email = params.email;

  if (!isDefined(email) && shouldFindMissingEmails && canFindEmail(params)) {
    const emailFinder = await callHunter({
      path: '/email-finder',
      query: toEmailFinderQuery(params),
    });

    if (emailFinder.status === 'error') {
      return {
        outcome: 'error',
        httpStatus: emailFinder.httpStatus,
        message: emailFinder.message,
      };
    }

    if (
      emailFinder.status === 'found' &&
      isNonEmptyString(emailFinder.json.email)
    ) {
      data.emailFinder = emailFinder.json as HunterEmailFinderResult;
      email = emailFinder.json.email;
      usage.credits += HUNTER_EMAIL_FINDER_CREDITS;
      usage.billedCalls += 1;
    }
  }

  if (isDefined(email)) {
    const combined = await callHunter({
      path: '/combined/find',
      query: { email },
    });

    // An email the finder already found and billed is kept even when the
    // enrichment behind it fails
    if (combined.status === 'error' && !isDefined(data.emailFinder)) {
      return {
        outcome: 'error',
        httpStatus: combined.httpStatus,
        message: combined.message,
      };
    }

    if (combined.status === 'found') {
      data.person = isRecord(combined.json.person)
        ? (combined.json.person as HunterPerson)
        : undefined;
      data.company = isRecord(combined.json.company)
        ? (combined.json.company as HunterCompany)
        : undefined;

      if (hasCorePersonData(data.person) || hasCoreCompanyData(data.company)) {
        usage.credits += HUNTER_ENRICHMENT_CREDITS;
        usage.billedCalls += 1;
      }
    }
  } else if (isDefined(params.linkedinHandle)) {
    const person = await callHunter({
      path: '/people/find',
      query: { linkedin_handle: params.linkedinHandle },
    });

    if (person.status === 'error') {
      return {
        outcome: 'error',
        httpStatus: person.httpStatus,
        message: person.message,
      };
    }

    if (person.status === 'found') {
      data.person = person.json as HunterPerson;

      if (hasCorePersonData(data.person)) {
        usage.credits += HUNTER_ENRICHMENT_CREDITS;
        usage.billedCalls += 1;
      }
    }
  }

  return isDefined(data.emailFinder) ||
    isDefined(data.person) ||
    isDefined(data.company)
    ? { outcome: 'matched', data }
    : { outcome: 'not_found' };
};
