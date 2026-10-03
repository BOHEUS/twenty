import axios from 'axios';
import { preparedWhatsappAPIAddress } from "src/logic-functions/data/prepared-whatsapp-api-address.util";

export const getGroupMessageParticipants = async (groupId: string): Promise<string[]> => {
  try {
    const response = await axios.get(preparedWhatsappAPIAddress(groupId), {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });
    const data = response.data as { participants: { wa_id: string; }[] };
    return data.participants.map((p) => p.wa_id);
  } catch (error) {
    return [];
  }
}