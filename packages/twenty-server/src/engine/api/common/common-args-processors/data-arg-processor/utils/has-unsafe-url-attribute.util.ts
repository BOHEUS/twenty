import { isString } from '@sniptt/guards';
import { isDefined, isSafeUrl } from 'twenty-shared/utils';

const URL_ATTRIBUTE_NAMES = ['href', 'src', 'url'];

export const hasUnsafeUrlAttribute = (attributes: Record<string, unknown>) =>
  URL_ATTRIBUTE_NAMES.some((attributeName) => {
    const value = attributes[attributeName];

    if (!isDefined(value)) {
      return false;
    }

    return (
      !isString(value) || (value.trim() !== '' && !isSafeUrl(value.trim()))
    );
  });
