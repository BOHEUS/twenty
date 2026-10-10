import { isNonEmptyString } from '@sniptt/guards';

import { type SnovEmailProfile } from 'src/types/snov-person-data';

export const findLinkedinSocialLink = (
  profile: SnovEmailProfile | undefined,
): string | undefined =>
  (profile?.social ?? []).find(
    (socialProfile) =>
      socialProfile.type?.toLowerCase() === 'linkedin' &&
      isNonEmptyString(socialProfile.link),
  )?.link ?? undefined;
