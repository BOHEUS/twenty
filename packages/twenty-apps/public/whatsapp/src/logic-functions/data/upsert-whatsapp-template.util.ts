import { CoreApiClient } from 'twenty-client-sdk/core';

type UpsertWhatsAppTemplateParams = {
  metaTemplateId: number | string;
  name: string;
  language: string;
  category?: string;
  status?: string;
  quality?: string;
  rejectedReason?: string | null;
  parameterFormat?: string;
  components?: object;
};

export const upsertWhatsAppTemplate = async ({
  metaTemplateId,
  ...data
}: UpsertWhatsAppTemplateParams) => {
  const client = new CoreApiClient();
  const metaTemplateIdText = String(metaTemplateId);

  const { whatsAppTemplates } = await client.query({
    whatsAppTemplates: {
      __args: { filter: { metaTemplateId: { eq: metaTemplateIdText } } },
      edges: { node: { id: true } },
    },
  });

  const existingId = whatsAppTemplates?.edges?.[0]?.node?.id;

  if (existingId === undefined) {
    await client.mutation({
      createWhatsAppTemplate: {
        __args: { data: { metaTemplateId: metaTemplateIdText, ...data } },
        id: true,
      },
    });
    return;
  }

  await client.mutation({
    updateWhatsAppTemplate: {
      __args: { id: existingId, data },
      id: true,
    },
  });
};
