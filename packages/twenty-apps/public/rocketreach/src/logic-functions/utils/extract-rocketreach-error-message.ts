import { isNonEmptyString, isObject, isString } from '@sniptt/guards';

import { isDefined } from 'src/logic-functions/utils/is-defined';

const extractMessageFromValue = (messageValue: unknown): string | undefined => {
  if (isNonEmptyString(messageValue)) {
    return messageValue;
  }

  if (Array.isArray(messageValue)) {
    const joinedMessages = messageValue.filter(isString).join('; ');

    return isNonEmptyString(joinedMessages) ? joinedMessages : undefined;
  }

  return undefined;
};

export const extractRocketReachErrorMessage = ({
  json,
  httpStatus,
}: {
  json: unknown;
  httpStatus: number;
}): string => {
  if (isObject(json)) {
    const responseBody = json as Record<string, unknown>;

    const messageFromBody =
      extractMessageFromValue(responseBody.detail) ??
      extractMessageFromValue(responseBody.message) ??
      extractMessageFromValue(responseBody.error);

    if (isDefined(messageFromBody)) {
      return messageFromBody;
    }
  }

  return `RocketReach request failed (HTTP ${httpStatus}).`;
};
