import { isString } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import { isRecord } from 'src/utils/is-record';

const DUPLICATE_VIOLATION_PHRASES = [
  'duplicate',
  'unique constraint',
  'uniqueness',
  'already exists',
  'is already in use',
  'violates unique',
  'duplicate_entry_detected',
];

const MAX_ERROR_TRAVERSAL_DEPTH = 4;

const stringifyWithoutThrowingOnCycles = (value: unknown): string => {
  try {
    return JSON.stringify(value) ?? '';
  } catch {
    return '';
  }
};

const collectErrorText = (error: unknown, depth = 0): string => {
  if (!isDefined(error) || depth > MAX_ERROR_TRAVERSAL_DEPTH) {
    return '';
  }

  if (isString(error)) {
    return error;
  }

  if (!isRecord(error)) {
    return String(error);
  }

  const textFragments: string[] = [];

  if (isString(error.message)) {
    textFragments.push(error.message);
  }

  if (Array.isArray(error.graphQLErrors)) {
    for (const graphQLError of error.graphQLErrors) {
      textFragments.push(collectErrorText(graphQLError, depth + 1));
    }
  }

  if (isRecord(error.extensions)) {
    const { code, userFriendlyMessage } = error.extensions;

    if (isString(code)) {
      textFragments.push(code);
    }

    if (isString(userFriendlyMessage)) {
      textFragments.push(userFriendlyMessage);
    }
  }

  if (isDefined(error.cause)) {
    textFragments.push(collectErrorText(error.cause, depth + 1));
  }

  textFragments.push(stringifyWithoutThrowingOnCycles(error));

  return textFragments.join(' ');
};

export const isUniqueViolationError = (error: unknown): boolean => {
  const lowerCaseErrorText = collectErrorText(error).toLowerCase();

  return DUPLICATE_VIOLATION_PHRASES.some((phrase) =>
    lowerCaseErrorText.includes(phrase),
  );
};
