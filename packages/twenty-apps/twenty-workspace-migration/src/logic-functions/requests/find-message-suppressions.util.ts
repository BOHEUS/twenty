import { type AxiosInstance } from "axios";
import { postGraphql } from "src/logic-functions/requests/graphql-client.util";
import { MessageSuppressionPage } from "src/logic-functions/types/emailing.type";

// The server caps a page at 100.
export const MESSAGE_SUPPRESSIONS_PAGE_SIZE = 100;

const QUERY = `query findMessageSuppressions($input: FindMessageSuppressionsInput!) {
  messageSuppressions(input: $input) {
    records {
      id
      emailAddress
      reason
      unsubscribeTopicId
    }
    totalCount
  }
}`;

export const findMessageSuppressions = async (
  client: AxiosInstance,
  offset: number,
  limit: number = MESSAGE_SUPPRESSIONS_PAGE_SIZE,
): Promise<MessageSuppressionPage> => {
  const data = await postGraphql<{ messageSuppressions: MessageSuppressionPage }>(
    client,
    '/metadata',
    'findMessageSuppressions',
    QUERY,
    { input: { offset, limit } },
  );

  return data.messageSuppressions;
}
