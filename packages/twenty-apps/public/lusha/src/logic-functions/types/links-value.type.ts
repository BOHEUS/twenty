type LinkValue = {
  url: string | null;
  label: string | null;
};

export type LinksValue = {
  primaryLinkUrl: string;
  primaryLinkLabel: string;
  secondaryLinks: LinkValue[] | null;
};
