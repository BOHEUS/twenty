import { DOCUMENTATION_BASE_URL } from 'twenty-shared/constants';

import { getDocumentationUrl } from '@/support/utils/getDocumentationUrl';

describe('getDocumentationUrl', () => {
  it('localizes the path on Twenty documentation', () => {
    expect(
      getDocumentationUrl({
        docsUrl: DOCUMENTATION_BASE_URL,
        locale: 'fr-FR',
        path: '/user-guide',
      }),
    ).toBe(`${DOCUMENTATION_BASE_URL}/fr/user-guide`);
  });

  it('links to the root of a custom documentation site', () => {
    expect(
      getDocumentationUrl({
        docsUrl: 'https://docs.acme.test',
        locale: 'fr-FR',
        path: '/user-guide',
      }),
    ).toBe('https://docs.acme.test');
  });
});
