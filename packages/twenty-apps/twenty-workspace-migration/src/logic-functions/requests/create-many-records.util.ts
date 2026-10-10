import { type AxiosInstance } from "axios";
import { postGraphql } from "src/logic-functions/requests/graphql-client.util";
import { capitalize } from "src/logic-functions/utils/capitalize.util";
import { toGraphQlLiteral } from "src/logic-functions/utils/to-graphql-literal.util";

// Upserting on the preserved source id makes replaying a page safe: a resumed invocation can
// resend records an earlier one already created before its checkpoint was saved.
export const createManyRecords = async (
  client: AxiosInstance,
  namePlural: string,
  data: Record<string, unknown>[],
  enumDataKeys: ReadonlySet<string>,
): Promise<{ id: string }[]> => {
  const operationName = `create${capitalize(namePlural)}`;
  const mutation = `mutation ${operationName} {
  ${operationName}(data: ${toGraphQlLiteral(data, enumDataKeys)}, upsert: true) {
    id
  }
}`;

  const responseData = await postGraphql<Record<string, { id: string }[]>>(
    client,
    '/graphql',
    operationName,
    mutation,
  );

  return responseData[operationName];
}
