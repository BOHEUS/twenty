import { isNonEmptyString } from '@sniptt/guards';
import { type LinkMetadataNullable } from 'twenty-shared/types';
import {
  isDefined,
  lowercaseUrlOriginAndRemoveTrailingSlash,
  parseJson,
} from 'twenty-shared/utils';

import { removeEmptyLinks } from 'src/engine/core-modules/record-transformer/utils/remove-empty-links';

export type LinksFieldGraphQLInput =
  | {
      primaryLinkUrl?: string | null;
      primaryLinkLabel?: string | null;
      secondaryLinks?: string | null;
    }
  | null
  | undefined;

export const transformLinksValue = (
  value: LinksFieldGraphQLInput,
): LinksFieldGraphQLInput => {
  if (!isDefined(value)) {
    return value;
  }

  const safeValue = value as NonNullable<LinksFieldGraphQLInput>;

  const hasPrimaryLinkUrl = 'primaryLinkUrl' in safeValue;
  const hasPrimaryLinkLabel = 'primaryLinkLabel' in safeValue;
  const hasSecondaryLinks = 'secondaryLinks' in safeValue;

  let primaryLinkUrl = safeValue.primaryLinkUrl;

  if (hasPrimaryLinkUrl && isDefined(primaryLinkUrl)) {
    primaryLinkUrl = lowercaseUrlOriginAndRemoveTrailingSlash(primaryLinkUrl);
  }

  const primaryLinkLabel = hasPrimaryLinkLabel
    ? (safeValue.primaryLinkLabel ?? null)
    : undefined;

  let secondaryLinksArray: LinkMetadataNullable[] | null | undefined =
    undefined;

  if (hasSecondaryLinks) {
    if (isNonEmptyString(safeValue.secondaryLinks)) {
      try {
        const parsedLinks = parseJson<LinkMetadataNullable[]>(
          safeValue.secondaryLinks,
        );

        if (parsedLinks) {
          secondaryLinksArray = parsedLinks
            .map((link: LinkMetadataNullable) => {
              if (!isDefined(link)) return link;

              return {
                url: isDefined(link.url)
                  ? lowercaseUrlOriginAndRemoveTrailingSlash(link.url)
                  : link.url,
                label: link.label,
              };
            })
            .filter(isDefined);
        } else {
          secondaryLinksArray = null;
        }
      } catch {
        secondaryLinksArray = null;
      }
    } else {
      secondaryLinksArray = safeValue.secondaryLinks;
    }
  }

  let processedLinks: {
    primaryLinkUrl: string | null;
    primaryLinkLabel: string | null;
    secondaryLinks: LinkMetadataNullable[] | null;
  };

  if (hasPrimaryLinkUrl || hasPrimaryLinkLabel || hasSecondaryLinks) {
    processedLinks = removeEmptyLinks({
      primaryLinkUrl: primaryLinkUrl ?? null,
      primaryLinkLabel: primaryLinkLabel ?? null,
      secondaryLinks: secondaryLinksArray ?? null,
    });
  } else {
    return {};
  }

  const result: NonNullable<LinksFieldGraphQLInput> = {};

  if (hasPrimaryLinkUrl) {
    result.primaryLinkUrl = processedLinks.primaryLinkUrl;
  }

  if (hasPrimaryLinkLabel) {
    result.primaryLinkLabel = processedLinks.primaryLinkLabel;
  }

  if (hasSecondaryLinks) {
    result.secondaryLinks = processedLinks.secondaryLinks
      ? JSON.stringify(processedLinks.secondaryLinks)
      : null;
  }

  return result;
};
