import { type PersonNode } from 'src/logic-functions/types/person-node';

export const PERSON_NODE_MOCK: PersonNode = {
  id: 'p1',
  name: { firstName: '', lastName: '' },
  emails: null,
  phones: null,
  jobTitle: '',
  linkedinLink: { primaryLinkUrl: 'https://linkedin.com/in/existing' },
  cognismId: null,
  cognismLastEnrichedAt: null,
};
