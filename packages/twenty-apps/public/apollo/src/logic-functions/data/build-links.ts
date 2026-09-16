import { isDefined } from './is-defined';
import { toText } from './to-text';

export const buildLinks = (
  url: unknown,
  label: string,
): { primaryLinkUrl: string; primaryLinkLabel: string } | undefined => {
  const primaryLinkUrl = toText(url);

  if (!isDefined(primaryLinkUrl)) {
    return undefined;
  }

  return { primaryLinkUrl, primaryLinkLabel: label };
};
