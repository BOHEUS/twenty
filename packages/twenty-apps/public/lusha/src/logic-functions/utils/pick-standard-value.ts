import { isArray } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import { toText } from 'src/logic-functions/data/to-text';
import { type LinksValue } from 'src/logic-functions/types/links-value.type';
import { type PartialNullable } from 'src/logic-functions/types/partial-nullable.type';

export const pickText = ({
  currentValue,
  lushaValue,
}: {
  currentValue: unknown;
  lushaValue: string | undefined;
}): string | undefined =>
  isDefined(toText(currentValue)) ? undefined : lushaValue;

export const pickFullName = ({
  currentName,
  lushaFirstName,
  lushaLastName,
}: {
  currentName:
    | { firstName?: string | null; lastName?: string | null }
    | null
    | undefined;
  lushaFirstName: string | undefined;
  lushaLastName: string | undefined;
}): { firstName: string; lastName: string } | undefined => {
  const currentFirstName = toText(currentName?.firstName);
  const currentLastName = toText(currentName?.lastName);
  const firstName = currentFirstName ?? lushaFirstName ?? '';
  const lastName = currentLastName ?? lushaLastName ?? '';

  const isUnchanged =
    firstName === (currentFirstName ?? '') &&
    lastName === (currentLastName ?? '');

  return isUnchanged ? undefined : { firstName, lastName };
};

export const pickLinks = ({
  currentLinks,
  lushaUrl,
}: {
  currentLinks: PartialNullable<LinksValue> | null | undefined;
  lushaUrl: string | undefined;
}): LinksValue | undefined => {
  if (!isDefined(lushaUrl) || isDefined(toText(currentLinks?.primaryLinkUrl))) {
    return undefined;
  }

  // Updating a links field clears whatever subfields the update leaves out, so
  // the label and secondary links go back as they were.
  return {
    primaryLinkUrl: lushaUrl,
    primaryLinkLabel: toText(currentLinks?.primaryLinkLabel) ?? '',
    secondaryLinks: isArray(currentLinks?.secondaryLinks)
      ? currentLinks.secondaryLinks
      : null,
  };
};
