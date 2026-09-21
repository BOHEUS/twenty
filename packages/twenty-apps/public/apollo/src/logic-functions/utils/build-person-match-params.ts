import { type PersonRecord } from 'src/logic-functions/types/person-record.type';
import { type ApolloPersonMatchParams } from 'src/logic-functions/utils/fetch-apollo-person';
import { isDefined } from '../data/is-defined';
import { normalizeDomain } from '../data/normalize-domain';
import { pruneUndefined } from '../data/prune-undefined';
import { toText } from '../data/to-text';

export const buildPersonMatchParams = (
  person: PersonRecord,
): ApolloPersonMatchParams | undefined => {
  const params = pruneUndefined({
    email: toText(person.emails?.primaryEmail),
    firstName: toText(person.name?.firstName),
    lastName: toText(person.name?.lastName),
    linkedinUrl: toText(person.linkedinLink?.primaryLinkUrl),
    domain: normalizeDomain(person.company?.domainName?.primaryLinkUrl),
  }) as ApolloPersonMatchParams;

  const hasStrongIdentifier =
    isDefined(params.email) || isDefined(params.linkedinUrl);
  const hasNameAndDomain =
    (isDefined(params.firstName) || isDefined(params.lastName)) &&
    isDefined(params.domain);

  return hasStrongIdentifier || hasNameAndDomain ? params : undefined;
};
