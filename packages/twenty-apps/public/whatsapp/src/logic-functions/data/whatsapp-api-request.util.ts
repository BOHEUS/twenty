import axios from 'axios';
import { preparedWhatsappAPIAddress } from 'src/logic-functions/data/prepared-whatsapp-api-address.util';
import { type WhatsAppApiEndpoints } from 'src/logic-functions/types/whatsapp-api.type';

type WhatsappApiRequestParams<TEndpoint extends keyof WhatsAppApiEndpoints> = {
  endpoint: TEndpoint;
  pathParams?: Record<string, string>;
  query?: WhatsAppApiEndpoints[TEndpoint]['query'];
  data?: WhatsAppApiEndpoints[TEndpoint]['request'];
};

export const whatsappApiRequest = async <TEndpoint extends keyof WhatsAppApiEndpoints>({
  endpoint,
  pathParams = {},
  query,
  data,
}: WhatsappApiRequestParams<TEndpoint>): Promise<WhatsAppApiEndpoints[TEndpoint]['response']> => {
  const [method, pathTemplate] = endpoint.split(' ');

  const path = pathTemplate.replace(/^\//, '').replace(/\{(\w+)\}/g, (_, name: string) =>
    encodeURIComponent(pathParams[name]),
  );

  const response = await axios.request({
    url: preparedWhatsappAPIAddress(path),
    method,
    params: query,
    data,
    headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
  });

  return response.data;
};
