import { toText } from 'src/logic-functions/utils/to-text';
import { type SnovPersonData } from 'src/types/snov-person-data';

export type SnovCurrentEmployer = {
  name?: string;
  website?: string;
  linkedinUrl?: string;
  title?: string;
  startDate?: string;
};

export const toCurrentEmployer = (
  personData: SnovPersonData,
): SnovCurrentEmployer => {
  const currentJob = personData.emailProfile?.currentJobs?.[0];

  if (currentJob !== undefined) {
    return {
      name: toText(currentJob.companyName),
      website: toText(currentJob.site),
      linkedinUrl: toText(currentJob.socialLink),
      title: toText(currentJob.position),
      startDate: toText(currentJob.startDate),
    };
  }

  const currentPosition = personData.linkedinProfile?.positions?.[0];

  return {
    name: toText(currentPosition?.name),
    website: toText(currentPosition?.url),
    linkedinUrl: toText(currentPosition?.linkedin_url),
    title: toText(currentPosition?.title),
  };
};
