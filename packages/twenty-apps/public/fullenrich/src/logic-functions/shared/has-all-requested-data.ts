import { isNonEmptyString } from '@sniptt/guards';

import { type RequestConstraint } from 'src/constants/application-variables';
import { type TwentyCompany, type TwentyPerson } from 'src/logic-functions/types/twenty.types';
import { isDefined } from 'src/logic-functions/utils/is-defined';

type ConstraintTarget = {
  person: TwentyPerson;
  company?: TwentyCompany;
};

const CONSTRAINT_PREDICATES: Record<
  RequestConstraint,
  (target: ConstraintTarget) => boolean
> = {
  'person.email': ({ person }) => isNonEmptyString(person.emails?.primaryEmail),
  'person.phones': ({ person }) =>
    isNonEmptyString(person.phones?.primaryPhoneNumber),
  'person.location': ({ person }) =>
    isNonEmptyString(person.fullEnrichLocation?.addressCity),
  'person.about': ({ person }) => isNonEmptyString(person.fullEnrichAbout),
  'person.jobTitle': ({ person }) => isNonEmptyString(person.jobTitle),
  'company.headcount': ({ company }) =>
    isDefined(company) && isDefined(company.fullEnrichHeadcount),
  'company.address': ({ company }) =>
    isNonEmptyString(company?.address?.addressStreet1) &&
    isNonEmptyString(company?.address?.addressCity) &&
    isNonEmptyString(company?.address?.addressCountry),
};

const isKnownConstraint = (
  constraint: string,
): constraint is RequestConstraint => constraint in CONSTRAINT_PREDICATES;

// An empty selection means nothing was asked for, so there is nothing that
// could already be satisfied and the record is always sent for enrichment
export const hasAllRequestedData = ({
  person,
  company,
  selectedConstraints,
}: ConstraintTarget & { selectedConstraints: string[] }): boolean => {
  const constraints = selectedConstraints.filter(isKnownConstraint);

  return (
    constraints.length > 0 &&
    constraints.every((constraint) =>
      CONSTRAINT_PREDICATES[constraint]({ person, company }),
    )
  );
};
