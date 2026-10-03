import { type CoreApiClient } from 'twenty-client-sdk/core';
import { parseWhatsappPhoneNumber } from 'src/logic-functions/data/parse-whatsapp-phone-number.util';

export const createPerson = async (client: CoreApiClient, wa_id: string, phoneNumber?: string, name?: string) => {
  const data: Record<string, any> = {};
  data.whatsAppId = wa_id;
  if (name) {
    data.name.firstName = name.split(' ')[0];
    data.name.lastName = name.split(' ')[1];
  }
  if (phoneNumber) {
    const parsedPhoneNumber = parseWhatsappPhoneNumber(phoneNumber);
    data.phones.primaryPhoneNumber = parsedPhoneNumber?.primaryPhoneNumber;
    data.phones.primaryPhoneCallingCode = parsedPhoneNumber?.primaryCallingCode;
  }

  return await client.mutation({
    createPerson: {
      __args: {
        data
      },
      id: true
    }
  })
}