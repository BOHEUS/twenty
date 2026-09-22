// Twenty's domainName is a link field, so it may hold a full URL, while
// FullEnrich matches on a bare domain
export const sanitizeDomain = (domainOrUrl: string | null | undefined): string => {
  if (!domainOrUrl) {
    return '';
  }

  return domainOrUrl
    .trim()
    .replace(/^[a-z]+:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/[/?#].*$/, '')
    .toLowerCase();
};
