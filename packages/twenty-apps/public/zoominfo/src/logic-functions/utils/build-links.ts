import { isDefined } from 'twenty-sdk/utils';

import { toText } from 'src/logic-functions/utils/to-text';
import { type LinksValue } from 'src/types/links-value';

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
