import { isDefined } from 'twenty-sdk/utils';

import { normalizeDomain } from 'src/logic-functions/data/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/data/normalize-linkedin-url';
import { pruneUndefined } from 'src/logic-functions/data/prune-undefined';
import { toEmail } from 'src/logic-functions/data/to-email';
import { toText } from 'src/logic-functions/data/to-text';
import { type LushaContactSearchItem } from 'src/logic-functions/types/lusha-search-item.type';
import { type PersonRecord } from 'src/logic-functions/types/person-record.type';

export const buildPersonSearchItem = (
  person: PersonRecord,
): LushaContactSearchItem | undefined => {
  const lushaId = toText(person.lushaId);

  if (isDefined(lushaId)) {
    return { clientReferenceId: person.id, id: lushaId };
  }

  const email = toEmail(person.emails?.primaryEmail);
  const linkedinUrl = normalizeLinkedinUrl(person.linkedinLink?.primaryLinkUrl);
  const firstName = toText(person.name?.firstName);
  const lastName = toText(person.name?.lastName);
  const companyName = toText(person.company?.name);
  const companyDomain = normalizeDomain(
    person.company?.domainName?.primaryLinkUrl,
  );

  // Lusha only matches a name when it comes with the employer, so the name
  // goes out as that complete set or not at all.
  const hasFullNameAndCompany =
    isDefined(firstName) &&
    isDefined(lastName) &&
    (isDefined(companyName) || isDefined(companyDomain));

  if (!isDefined(email) && !isDefined(linkedinUrl) && !hasFullNameAndCompany) {
    return undefined;
  }

  return {
    clientReferenceId: person.id,
    ...pruneUndefined({
      email,
      linkedinUrl,
      ...(hasFullNameAndCompany
        ? { firstName, lastName, companyName, companyDomain }
        : {}),
    }),
  };
};
