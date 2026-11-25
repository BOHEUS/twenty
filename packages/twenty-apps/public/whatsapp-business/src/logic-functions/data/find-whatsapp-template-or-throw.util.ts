import { isNonEmptyString } from '@sniptt/guards';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { isDefined } from 'twenty-sdk/utils';

type WhatsAppTemplateRecord = {
  id: string;
  metaTemplateId: string;
  name: string;
  parameterFormat: string | null;
  whatsAppBusinessAccountId: string;
};

export const findWhatsAppTemplateOrThrow = async (templateId: string): Promise<WhatsAppTemplateRecord> => {
  const { whatsAppTemplate } = await new CoreApiClient().query({
    whatsAppTemplate: {
      __args: { filter: { id: { eq: templateId } } },
      id: true,
      metaTemplateId: true,
      name: true,
      parameterFormat: true,
      whatsAppBusinessAccountId: true,
    },
  });

  if (!isDefined(whatsAppTemplate)) {
    throw new Error(`WhatsApp template ${templateId} not found`);
  }

  const { metaTemplateId, name, whatsAppBusinessAccountId } = whatsAppTemplate;

  if (!isNonEmptyString(whatsAppBusinessAccountId)) {
    throw new Error('Template is not linked to a WhatsApp Business Account, reconnect WhatsApp to resync it');
  }

  if (!isNonEmptyString(metaTemplateId) || !isNonEmptyString(name)) {
    throw new Error(`WhatsApp template ${templateId} is missing its Meta ID or name, reconnect WhatsApp to resync it`);
  }

  return {
    id: whatsAppTemplate.id,
    metaTemplateId,
    name,
    parameterFormat: whatsAppTemplate.parameterFormat ?? null,
    whatsAppBusinessAccountId,
  };
};
