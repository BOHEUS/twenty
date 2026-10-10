import { toText } from 'src/logic-functions/utils/to-text';

const LINKEDIN_PROFILE_PATH_REGEX = /linkedin\.com\/in\/([^/?#]+)/i;

export const extractLinkedinHandle = (
  linkedinUrl: unknown,
): string | undefined => {
  const handle = toText(linkedinUrl)?.match(LINKEDIN_PROFILE_PATH_REGEX)?.[1];

  if (handle === undefined) {
    return undefined;
  }

  try {
    return decodeURIComponent(handle);
  } catch {
    return handle;
  }
};
