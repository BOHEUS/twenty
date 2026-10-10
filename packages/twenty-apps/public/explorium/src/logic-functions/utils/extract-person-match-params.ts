import { toText } from 'src/logic-functions/utils/to-text';
import { type ExploriumProspectMatchInput } from 'src/types/explorium-match-inputs';
import { type ExploriumMatchParams } from 'src/types/explorium-match-params';
import { type PersonNode } from 'src/types/person-node';
import { isDefined } from 'src/utils/is-defined';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const extractPersonMatchParams = ({
  node,
}: {
  node: PersonNode;
}): ExploriumMatchParams<ExploriumProspectMatchInput> | undefined => {
  const existingExploriumId = toText(node.exploriumId);
  if (isDefined(existingExploriumId)) {
    return { exploriumId: existingExploriumId };
  }

  const linkedin = toText(node.linkedinLink?.primaryLinkUrl);
  const email = toText(node.emails?.primaryEmail);
  const fullName = toText(
    [node.name?.firstName, node.name?.lastName]
      .map((namePart) => toText(namePart))
      .filter(isDefined)
      .join(' '),
  );
  const companyName = toText(node.company?.name);

  const hasStrongIdentifier = isDefined(linkedin) || isDefined(email);
  const hasNameAndCompany = isDefined(fullName) && isDefined(companyName);

  if (!hasStrongIdentifier && !hasNameAndCompany) {
    return undefined;
  }

  return {
    matchInput: pruneUndefined({
      email,
      linkedin,
      full_name: fullName,
      company_name: companyName,
    }),
  };
};
