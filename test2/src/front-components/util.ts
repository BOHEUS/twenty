import { RestApiClient } from 'twenty-client-sdk/rest';
import { enqueueSnackbar } from 'twenty-sdk/front-component';

export const execute = async ({path}: {
  path: string;
}) => {
  try {
    const client = new RestApiClient();

    await client.get(`/s${path}`);

    await enqueueSnackbar({
      message: 'Test',
      variant: 'success',
    });
  } catch {
    await enqueueSnackbar({
      message: 'Records enrichment failed',
      variant: 'error',
    });
  }
};
