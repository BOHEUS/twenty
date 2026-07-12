import {CoreApiClient} from "twenty-client-sdk/core";

export const updateMessage = async (client: CoreApiClient, messageId: string, text: string) => {
    return await client.mutation({
        updateMessage: {
            __args: {
                id: messageId,
                data: {
                    text: text,
                }
            }
        }
    })
}