import { toText } from 'src/logic-functions/utils/to-text';
import { type LinksValue } from 'src/logic-functions/types/links-value';
import { isDefined } from 'src/logic-functions/data/is-defined';

export const buildLinks = ({
  url,
  label,
}: {
  url: unknown;
  label?: unknown;
}): LinksValue | undefined => {
  const primaryLinkUrl = toText(url);

  if (!isDefined(primaryLinkUrl)) {
    return undefined;
  }

  return {
    primaryLinkUrl,
    primaryLinkLabel: toText(label) ?? '',
    secondaryLinks: null,
  };
};
