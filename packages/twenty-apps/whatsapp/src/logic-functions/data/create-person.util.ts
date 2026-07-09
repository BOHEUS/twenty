import { type CoreApiClient } from 'twenty-client-sdk/core';
import { parseWhatsappPhoneNumber } from 'src/logic-functions/data/parse-whatsapp-phone-number.util';

export const createPerson = async (client: CoreApiClient, phoneNumber: string, name: string) => {
  const number = parseWhatsappPhoneNumber(phoneNumber);
  return await client.mutation({
    createPerson: {
      __args: {
        data: {
          phones: {
            primaryPhoneCallingCode: number?.primaryCallingCode,
            primaryPhoneNumber: number?.primaryPhoneNumber,
          },
          name: {
            firstName: name.split(' ',1)[0],
            lastName: name.split(' ',1)[1],
          }
        },
      },
      id: true
    }
  })
}