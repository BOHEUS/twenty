import { WHATSAPP_API_VERSION } from 'src/constants/whatsapp-api-version.constant';
import { WHATSAPP_API_ADDRESS } from 'src/constants/whatsapp-api-address.constant';

export const preparedWhatsappAPIAddress = (...values: string[]) => {
  return WHATSAPP_API_ADDRESS.concat(WHATSAPP_API_VERSION, '/', ...values);
};
