import { buildLinks } from 'src/logic-functions/utils/build-links';
import { toText } from 'src/logic-functions/utils/to-text';
import { type LinksValue } from 'src/types/links-value';

const LEADING_SLASHES_REGEX = /^\/+/;

// Hunter returns social profiles as handles, not URLs
export const buildSocialLink = ({
  baseUrl,
  handle,
}: {
  baseUrl: string;
  handle: unknown;
}): LinksValue | undefined => {
  const handleText = toText(handle)?.replace(LEADING_SLASHES_REGEX, '');

  return handleText === undefined
    ? undefined
    : buildLinks({ url: `${baseUrl}/${handleText}` });
};
