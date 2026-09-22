import { isNonEmptyString } from '@sniptt/guards';
import { RetryableLogicFunctionError } from 'twenty-sdk/logic-function';

import { FULLENRICH_MAX_CONTACTS_PER_REQUEST } from 'src/constants/fullenrich-api';
import { fetchTwentyCompanies } from 'src/logic-functions/data/fetch-records.util';
import {
  buildEnrichmentRequest,
  buildEnrichmentRequestContact,
} from 'src/logic-functions/shared/build-enrichment-request';
import { buildWebhookUrl } from 'src/logic-functions/shared/build-webhook-url';
import {
  getFullEnrichApiKey,
  getSelectedEnrichFields,
  getSelectedRequestConstraints,
} from 'src/logic-functions/shared/get-application-variables';
import { hasAllRequestedData } from 'src/logic-functions/shared/has-all-requested-data';
import { sendRequestToFullEnrich } from 'src/logic-functions/shared/send-request-to-fullenrich';
import { type FullEnrichRequestContact } from 'src/logic-functions/types/fullenrich.types';
import { type TwentyCompany, type TwentyPerson } from 'src/logic-functions/types/twenty.types';
import { isDefined } from 'src/logic-functions/utils/is-defined';

export type EnrichPeopleResult = {
  submitted: number;
  skipped: number;
  enrichmentId?: string;
};

// A rate limit or an outage is worth another delivery; a rejected request is
// not going to succeed on a retry
const isTransientFailure = (status: number | undefined): boolean =>
  !isDefined(status) || status === 429 || status >= 500;

const fetchCompaniesByPersonCompanyId = async (
  people: TwentyPerson[],
): Promise<Map<string, TwentyCompany>> => {
  const companyIds = people
    .map(({ companyId }) => companyId)
    .filter(isNonEmptyString);

  const companies = await fetchTwentyCompanies(companyIds);

  return new Map(companies.map((company) => [company.id, company]));
};

// Sends one bulk request, so the caller has to keep a batch within the API's
// per-request limit. Throws rather than reporting failures: the job runner
// records the error and redelivers when the cause was transient.
export const enrichPeople = async ({
  people,
}: {
  people: TwentyPerson[];
}): Promise<EnrichPeopleResult> => {
  if (people.length === 0) {
    return { submitted: 0, skipped: 0 };
  }

  const apiKeyResult = getFullEnrichApiKey();
  if (!apiKeyResult.success) {
    throw new Error(apiKeyResult.error);
  }

  const webhookUrlResult = buildWebhookUrl();
  if (!webhookUrlResult.success) {
    throw new Error(webhookUrlResult.error);
  }

  const enrichFields = getSelectedEnrichFields();
  const selectedConstraints = getSelectedRequestConstraints();
  const companiesById = await fetchCompaniesByPersonCompanyId(people);
  const contacts: FullEnrichRequestContact[] = [];
  let skipped = 0;

  for (const person of people) {
    const company = isNonEmptyString(person.companyId)
      ? companiesById.get(person.companyId)
      : undefined;

    if (hasAllRequestedData({ person, company, selectedConstraints })) {
      skipped += 1;
      continue;
    }

    const contact = buildEnrichmentRequestContact({
      person,
      company,
      enrichFields,
    });

    if (!isDefined(contact)) {
      console.warn(
        `Person ${person.id} has neither a LinkedIn URL nor a full name with a company, so FullEnrich cannot match it.`,
      );
      skipped += 1;
      continue;
    }

    contacts.push(contact);
  }

  if (contacts.length === 0) {
    return { submitted: 0, skipped };
  }

  if (contacts.length > FULLENRICH_MAX_CONTACTS_PER_REQUEST) {
    throw new Error(
      `A batch carries ${contacts.length} contacts, more than the ${FULLENRICH_MAX_CONTACTS_PER_REQUEST} FullEnrich accepts per request.`,
    );
  }

  const sendResult = await sendRequestToFullEnrich({
    request: buildEnrichmentRequest({
      contacts,
      webhookUrl: webhookUrlResult.webhookUrl,
    }),
    apiKey: apiKeyResult.apiKey,
  });

  if (!sendResult.success) {
    if (isTransientFailure(sendResult.status)) {
      throw new RetryableLogicFunctionError(sendResult.error);
    }

    throw new Error(sendResult.error);
  }

  return {
    submitted: contacts.length,
    skipped,
    enrichmentId: sendResult.enrichmentId,
  };
};
