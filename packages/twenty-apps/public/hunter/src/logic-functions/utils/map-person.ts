import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildEmails } from 'src/logic-functions/utils/build-emails';
import { buildFullName } from 'src/logic-functions/utils/build-full-name';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { buildPhones } from 'src/logic-functions/utils/build-phones';
import { buildSocialLink } from 'src/logic-functions/utils/build-social-link';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { toText } from 'src/logic-functions/utils/to-text';
import { type HunterPersonData } from 'src/types/hunter-person-data';
import { type MappedRecord } from 'src/types/mapped-record';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const mapPerson = (personData: HunterPersonData): MappedRecord => {
  const { person, emailFinder } = personData;
  const foundEmail = toText(emailFinder?.email);

  // A found email is written only when Hunter verified it; accept-all and
  // unknown addresses stay in the Found Email field
  const isFoundEmailVerified = emailFinder?.verification?.status === 'valid';

  const standard = pruneUndefined({
    name: buildFullName({
      firstName: person?.name?.givenName,
      lastName: person?.name?.familyName,
      fullName: person?.name?.fullName,
    }),
    emails: buildEmails([
      isFoundEmailVerified ? foundEmail : undefined,
      emailFinder === undefined ? person?.email : undefined,
    ]),
    phones: buildPhones([person?.phone, emailFinder?.phone_number]),
    jobTitle:
      toText(person?.employment?.title) ?? toText(emailFinder?.position),
    linkedinLink:
      buildSocialLink({
        baseUrl: 'https://www.linkedin.com/in',
        handle: person?.linkedin?.handle,
      }) ?? buildLinks({ url: emailFinder?.linkedin_url }),
  });

  const hunter = pruneUndefined({
    hunterId: toText(person?.id),
    hunterBio: toText(person?.bio),
    hunterSite: buildLinks({ url: person?.site }),
    hunterTimeZone: toText(person?.timeZone),
    hunterLocation: buildAddress({
      city: person?.geo?.city,
      state: person?.geo?.state,
      country: person?.geo?.country,
      geo:
        toNumber(person?.geo?.lat) !== undefined &&
        toNumber(person?.geo?.lng) !== undefined
          ? `${person?.geo?.lat},${person?.geo?.lng}`
          : undefined,
    }),
    hunterRole: toText(person?.employment?.role),
    hunterSubRole: toText(person?.employment?.subRole),
    hunterSeniority: toText(person?.employment?.seniority),
    hunterXLink: buildSocialLink({
      baseUrl: 'https://x.com',
      handle: person?.twitter?.handle,
    }),
    hunterXFollowers: toNumber(person?.twitter?.followers),
    hunterGithubLink: buildSocialLink({
      baseUrl: 'https://github.com',
      handle: person?.github?.handle,
    }),
    hunterGithubFollowers: toNumber(person?.github?.followers),
    hunterFacebookLink: buildSocialLink({
      baseUrl: 'https://www.facebook.com',
      handle: person?.facebook?.handle,
    }),
    hunterEmailProvider: toText(person?.emailProvider),
    hunterFoundEmail: foundEmail,
    hunterEmailStatus: toText(emailFinder?.verification?.status),
    hunterEmailScore: toNumber(emailFinder?.score),
    hunterEmailSources: toJsonArray(emailFinder?.sources),
  });

  return { standard, hunter };
};
