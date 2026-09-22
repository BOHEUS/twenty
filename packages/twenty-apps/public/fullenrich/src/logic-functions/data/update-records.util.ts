import { CoreApiClient } from 'twenty-client-sdk/core';

import {
  type TwentyCompanyUpdate,
  type TwentyPersonUpdate,
} from 'src/logic-functions/types/twenty.types';

export const updatePersonInTwenty = async ({
  personId,
  updateData,
  client,
}: {
  personId: string;
  updateData: TwentyPersonUpdate;
  client: CoreApiClient;
}): Promise<void> => {
  const result = await client.mutation({
    updatePerson: {
      __args: { id: personId, data: updateData },
      id: true,
    },
  });

  if (!result?.updatePerson) {
    throw new Error(`Failed to update person ${personId}: no result`);
  }
};

export const updateCompanyInTwenty = async ({
  companyId,
  updateData,
  client,
}: {
  companyId: string;
  updateData: TwentyCompanyUpdate;
  client: CoreApiClient;
}): Promise<void> => {
  const result = await client.mutation({
    updateCompany: {
      __args: { id: companyId, data: updateData },
      id: true,
    },
  });

  if (!result?.updateCompany) {
    throw new Error(`Failed to update company ${companyId}: no result`);
  }
};
