import { type CoreApiClient } from 'twenty-client-sdk/core';

export const findPersonByFilter = async (client: CoreApiClient, phoneNumber: string, whatsAppId: string) => {
  return await client.query({
    people: {
      __args: {
        filter: {
          phones: {
            primaryPhoneNumber: {
              eq: phoneNumber,
            },
            primaryPhoneCallingCode: {
              eq: phoneNumber
            }
          },
          whatsAppId: {
            eq: whatsAppId,
          },
        }
      },
      edges: {
        node: {
          id: true,
        }
      },
      totalCount: true
    }
  })
}