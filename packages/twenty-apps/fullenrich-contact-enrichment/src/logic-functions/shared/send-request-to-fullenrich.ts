import { fullEnrichRequest } from './types';
import axios from 'axios';

export const sendRequestToFullEnrich = async (
  data: fullEnrichRequest,
): Promise<boolean> => {
  const FULL_ENRICH_API_URL =
    'https://app.fullenrich.com/api/v1/contact/enrich/bulk';
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FULL_ENRICH_API_KEY}`,
      'Content-Type': 'application/json',
    },
    url: FULL_ENRICH_API_URL,
    data: data,
  };
  try {
    const response = await axios.request(options);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    return false;
  }
};
