import { isNonEmptyString } from '@sniptt/guards';

import { isDefined } from 'src/utils/is-defined';
import { isRecord } from 'src/utils/is-record';

const extractMessageFromValue = (messageValue: unknown): string | undefined => {
  if (isNonEmptyString(messageValue)) {
    return messageValue;
  }

  if (Array.isArray(messageValue)) {
    const joinedMessages = messageValue
      .map((entry) =>
        isRecord(entry)
          ? extractMessageFromValue(entry.msg)
          : extractMessageFromValue(entry),
      )
      .filter(isDefined)
      .join('; ');

    return isNonEmptyString(joinedMessages) ? joinedMessages : undefined;
  }

  return undefined;
};

export const extractExploriumErrorMessage = ({
  json,
  httpStatus,
}: {
  json: unknown;
  httpStatus: number;
}): string => {
  if (isRecord(json)) {
    const message =
      extractMessageFromValue(json.details) ??
      extractMessageFromValue(json.detail) ??
      extractMessageFromValue(json.message) ??
      extractMessageFromValue(json.error);

    if (isDefined(message)) {
      return message;
    }
  }

  return `Explorium request failed (HTTP ${httpStatus}).`;
};
