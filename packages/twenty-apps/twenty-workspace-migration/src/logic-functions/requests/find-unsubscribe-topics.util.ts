import { type AxiosInstance } from "axios";
import { postGraphql } from "src/logic-functions/requests/graphql-client.util";
import { UnsubscribeTopic } from "src/logic-functions/types/emailing.type";

const QUERY = `query findUnsubscribeTopics {
  unsubscribeTopics {
    id
    name
    description
    visibility
  }
}`;

export const findUnsubscribeTopics = async (client: AxiosInstance): Promise<UnsubscribeTopic[]> => {
  const data = await postGraphql<{ unsubscribeTopics: UnsubscribeTopic[] }>(
    client,
    '/metadata',
    'findUnsubscribeTopics',
    QUERY,
  );

  return data.unsubscribeTopics;
}
