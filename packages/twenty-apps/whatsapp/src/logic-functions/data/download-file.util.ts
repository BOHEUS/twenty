import { type WhatsappFile } from 'src/logic-functions/types/whatsapp-file.type';
import axios from 'axios';
import {preparedWhatsappAPIAddress} from "src/logic-functions/data/prepared-whatsapp-api-address.util";

export const downloadWhatsAppFile = async (fileData: WhatsappFile) => {
    if (!process.env.ACCESS_TOKEN) {
        return false;
    }
    try {
        const response = await axios.get(preparedWhatsappAPIAddress(fileData.url), {
            headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                Accept: 'application/json, application/octet-stream',
            }
        });
        if (response.status !== 200) {
            return false;
        }
        response.data; // ???
    }
    catch (error) {
        console.error(error);
        return false;
    }
}