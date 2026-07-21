import { type CoreApiClient } from "twenty-client-sdk/core";

export const findUser = async (client: CoreApiClient, email: string) => {
  return await client.query({
    workspaceMembers: {
      __args: {
        filter: {
          userEmail: {
            eq: email,
          }
        }
      },
      edges: {
        node: {
          id: true
        }
      }
    }
  })
}