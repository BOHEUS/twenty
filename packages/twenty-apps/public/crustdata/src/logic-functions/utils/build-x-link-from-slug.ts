import { toText } from 'src/logic-functions/utils/to-text';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { type LinksValue } from 'src/types/links-value';
import { isDefined } from 'src/utils/is-defined';

// Crustdata returns the X handle as a bare slug, not a URL.
export const buildXLinkFromSlug = (slug: unknown): LinksValue | undefined => {
  const handle = toText(slug)?.replace(/^@/, '');

  if (!isDefined(handle) || handle === '') {
    return undefined;
  }

  return buildLinks({ url: `https://x.com/${handle}`, label: `@${handle}` });
};
