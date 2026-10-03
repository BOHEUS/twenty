import axios from 'axios';
import { whatsappApiRequest } from 'src/logic-functions/data/whatsapp-api-request.util';

export const downloadWhatsAppFile = async (mediaId: string) => {
  const { url, mime_type } = await whatsappApiRequest({
    endpoint: 'GET /{mediaId}',
    pathParams: { mediaId },
  });

  const { data } = await axios.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer',
    headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
  });

  return { fileBuffer: Buffer.from(data), mimeType: mime_type };
};
