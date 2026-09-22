import { fullEnrichTwentyPerson } from "src/logic-functions/shared/types";
import { type CoreApiClient } from "twenty-client-sdk/core";

export const updatePersonInTwenty = async (
  personId: string,
  updateData: fullEnrichTwentyPerson,
  client: CoreApiClient
) => {
  const result = await client.mutation({
    updatePerson: {
      __args: {
        id: personId,
        data: updateData,
      },
      id: true,
    },
  });

  if (!result.updateCompany) {
    throw new Error(`Failed to update person ${personId}: no result`);
  }
  return true;
};