import { isNonEmptyString } from '@sniptt/guards';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';

import { FULLENRICH_SIGNATURE_HEADER } from 'src/constants/fullenrich-api';
import { WEBHOOK_FUNCTION_PATH } from 'src/constants/universal-identifiers';
import { buildTwentyCompany } from 'src/logic-functions/data/build-twenty-company.util';
import { buildTwentyPerson } from 'src/logic-functions/data/build-twenty-person.util';
import { fetchTwentyCompanies } from 'src/logic-functions/data/fetch-records.util';
import {
  updateCompanyInTwenty,
  updatePersonInTwenty,
} from 'src/logic-functions/data/update-records.util';
import { getFullEnrichApiKey } from 'src/logic-functions/shared/get-application-variables';
import { verifyWebhookSignature } from 'src/logic-functions/shared/verify-webhook-signature';
import { sanitizeDomain } from 'src/logic-functions/utils/sanitize-domain.util';
import { type FullEnrichWebhookPayload } from 'src/logic-functions/types/fullenrich.types';
import { type TwentyCompany } from 'src/logic-functions/types/twenty.types';
import { isDefined } from 'src/logic-functions/utils/is-defined';

type WebhookResult = { updatedPeople: number; updatedCompanies: number };

const isSameCompany = ({
  linkedCompany,
  returnedDomain,
  returnedName,
}: {
  linkedCompany: TwentyCompany;
  returnedDomain: string | undefined;
  returnedName: string | undefined;
}): boolean => {
  const linkedDomain = sanitizeDomain(linkedCompany.domainName?.primaryLinkUrl);
  const enrichedDomain = sanitizeDomain(returnedDomain);

  if (isNonEmptyString(linkedDomain) && isNonEmptyString(enrichedDomain)) {
    return linkedDomain === enrichedDomain;
  }

  return (
    isNonEmptyString(linkedCompany.name) &&
    isNonEmptyString(returnedName) &&
    linkedCompany.name.trim().toLowerCase() === returnedName.trim().toLowerCase()
  );
};

const handler = async (
  event: RoutePayload<FullEnrichWebhookPayload>,
): Promise<WebhookResult | { error: string }> => {
  const apiKeyResult = getFullEnrichApiKey();

  if (!apiKeyResult.success) {
    return { error: apiKeyResult.error };
  }

  const { rawBody } = event;

  if (!isDefined(rawBody)) {
    return {
      error:
        'Invalid webhook signature: raw request body was not forwarded by the server, cannot verify HMAC',
    };
  }

  const signatureCheck = verifyWebhookSignature({
    rawBody,
    signatureHeader: event.headers[FULLENRICH_SIGNATURE_HEADER],
    apiKey: apiKeyResult.apiKey,
  });

  if (!signatureCheck.valid) {
    return { error: `Invalid webhook signature: ${signatureCheck.error}` };
  }

  const body = event.body;

  if (!isDefined(body) || !isDefined(body.data)) {
    return { error: 'Webhook payload carried no enrichment data' };
  }

  // One query for every linked company, rather than one per record: a batch
  // webhook carries up to 100 records
  const linkedCompaniesById = new Map(
    (
      await fetchTwentyCompanies(
        body.data
          .map(({ custom }) => custom?.companyId)
          .filter(isNonEmptyString),
      )
    ).map((company) => [company.id, company]),
  );

  const client = new CoreApiClient();
  const enrichedAt = new Date().toISOString();
  let updatedPeople = 0;
  let updatedCompanies = 0;

  for (const record of body.data) {
    const { custom, contact_info: contactInfo, profile } = record;

    if (!isNonEmptyString(custom?.personId)) {
      console.warn('Skipping FullEnrich record without a Twenty person id.');
      continue;
    }

    await updatePersonInTwenty({
      personId: custom.personId,
      updateData: buildTwentyPerson({ profile, contactInfo, enrichedAt }),
      client,
    });
    updatedPeople += 1;

    const enrichedCompany = profile?.employment?.current?.company;

    if (!isNonEmptyString(custom.companyId) || !isDefined(enrichedCompany)) {
      continue;
    }

    const linkedCompany = linkedCompaniesById.get(custom.companyId);

    if (!isDefined(linkedCompany)) {
      console.warn(`Company ${custom.companyId} not found.`);
      continue;
    }

    if (
      !isSameCompany({
        linkedCompany,
        returnedDomain: enrichedCompany.domain ?? enrichedCompany.website,
        returnedName: enrichedCompany.name,
      })
    ) {
      console.warn(
        `Skipping company ${custom.companyId}: FullEnrich returned "${enrichedCompany.name}" as the current employer of person ${custom.personId}.`,
      );
      continue;
    }

    await updateCompanyInTwenty({
      companyId: custom.companyId,
      updateData: buildTwentyCompany({ company: enrichedCompany, enrichedAt }),
      client,
    });
    updatedCompanies += 1;
  }

  return { updatedPeople, updatedCompanies };
};

export default defineLogicFunction({
  universalIdentifier: '8672b95c-949c-421a-9aa8-085ddea5bb2f',
  name: 'on-webhook',
  description: 'Writes FullEnrich enrichment results back onto Twenty records',
  timeoutSeconds: 900,
  handler,
  httpRouteTriggerSettings: {
    path: WEBHOOK_FUNCTION_PATH,
    httpMethod: 'POST',
    isAuthRequired: false,
    forwardedRequestHeaders: [FULLENRICH_SIGNATURE_HEADER],
  },
});
