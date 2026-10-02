import request from 'supertest';
import { DEFAULT_BRAND } from 'twenty-shared/constants';

import { type EnterprisePlanService } from 'src/engine/core-modules/enterprise/services/enterprise-plan.service';

import { createConfigVariable } from 'test/integration/twenty-config/utils/create-config-variable.util';
import { deleteConfigVariable } from 'test/integration/twenty-config/utils/delete-config-variable.util';
import { getAppProviderByClassName } from 'test/integration/utils/get-app-provider-by-class-name.util';

const getClientConfig = async () => {
  const response = await request(`http://localhost:${APP_PORT}`)
    .get('/client-config')
    .expect(200);

  return response.body;
};

describe('ClientConfig brand (integration)', () => {
  let enterprisePlanService: EnterprisePlanService;

  beforeAll(async () => {
    enterprisePlanService = getAppProviderByClassName<EnterprisePlanService>(
      'EnterprisePlanService',
    );

    await createConfigVariable({
      input: { key: 'BRAND_NAME', value: 'Acme CRM' },
    });
  });

  afterAll(async () => {
    jest.restoreAllMocks();

    await deleteConfigVariable({ input: { key: 'BRAND_NAME' } }).catch(
      () => {},
    );
  });

  it('returns the Twenty brand without a valid Enterprise key', async () => {
    jest.spyOn(enterprisePlanService, 'isValid').mockReturnValue(false);

    const clientConfig = await getClientConfig();

    expect(clientConfig.brand).toEqual(DEFAULT_BRAND);
  });

  it('returns the configured brand and disables support with a valid key', async () => {
    jest.spyOn(enterprisePlanService, 'isValid').mockReturnValue(true);

    const clientConfig = await getClientConfig();

    expect(clientConfig.brand).toMatchObject({
      isWhiteLabeled: true,
      name: 'Acme CRM',
      websiteUrl: DEFAULT_BRAND.websiteUrl,
      supportEmail: null,
    });
    expect(clientConfig.support).toEqual({ supportDriver: 'NONE' });
  });
});
