import { isNonEmptyArray, isNonEmptyString } from '@sniptt/guards';

import {
  AMPLEMARKET_EMAIL_REVEAL_EMAIL_CREDITS,
  AMPLEMARKET_PERSON_FOUND_EMAIL_CREDITS,
  AMPLEMARKET_PHONE_REVEAL_PHONE_CREDITS,
} from 'src/constants/amplemarket-credit-costs';
import { callAmplemarket } from 'src/logic-functions/utils/call-amplemarket';
import { type AmplemarketContactType } from 'src/types/amplemarket-contact-type';
import { type AmplemarketEnrichResult } from 'src/types/amplemarket-enrich-result';
import { type AmplemarketPerson } from 'src/types/amplemarket-person';
import { type AmplemarketPersonMatchParams } from 'src/types/amplemarket-person-match-params';
import { type AmplemarketUsage } from 'src/types/amplemarket-usage';
import { isDefined } from 'src/utils/is-defined';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const lookupAmplemarketPerson = async ({
  params,
  contactTypes,
  usage,
  deadline,
}: {
  params: AmplemarketPersonMatchParams;
  contactTypes: AmplemarketContactType[];
  usage: AmplemarketUsage;
  deadline: number;
}): Promise<AmplemarketEnrichResult<AmplemarketPerson>> => {
  // Reveals cost extra credits, so they are only asked for when the record
  // is missing that contact detail
  const shouldRevealEmail =
    contactTypes.includes('email') && !isDefined(params.email);
  const shouldRevealPhones = contactTypes.includes('phone') && !params.hasPhone;

  const response = await callAmplemarket({
    path: '/people/find',
    query: pruneUndefined({
      email: params.email,
      linkedin_url: params.linkedinUrl,
      name: params.name,
      company_domain: params.companyDomain,
      company_name: isDefined(params.companyDomain)
        ? undefined
        : params.companyName,
      reveal_email: shouldRevealEmail ? 'true' : undefined,
      reveal_phone_numbers: shouldRevealPhones ? 'true' : undefined,
    }),
    deadline,
  });

  if (response.status === 'error') {
    return {
      outcome: 'error',
      httpStatus: response.httpStatus,
      message: response.message,
    };
  }

  if (response.status === 'not_found') {
    return { outcome: 'not_found' };
  }

  // The response body is untyped JSON; fields are read defensively by the mappers
  const person = response.json as AmplemarketPerson;

  usage.emailCredits += AMPLEMARKET_PERSON_FOUND_EMAIL_CREDITS;
  usage.billedRecords += 1;

  if (shouldRevealEmail && isNonEmptyString(person.email)) {
    usage.emailCredits += AMPLEMARKET_EMAIL_REVEAL_EMAIL_CREDITS;
  }

  if (shouldRevealPhones && isNonEmptyArray(person.phone_numbers ?? [])) {
    usage.phoneCredits += AMPLEMARKET_PHONE_REVEAL_PHONE_CREDITS;
  }

  return { outcome: 'matched', data: person };
};
