import { type TemplateParameterInput } from 'src/logic-functions/data/send-template-message-params.schema';
import { type WhatsAppApiSendMessageRequest } from 'src/logic-functions/types/whatsapp-api.type';

type TemplateMessage = Extract<WhatsAppApiSendMessageRequest, { type: 'template' }>['template'];

export const buildTemplateComponents = (
  parameters: TemplateParameterInput[],
  parameterFormat: string | null | undefined,
): TemplateMessage['components'] => {
  if (parameters.length === 0) {
    return undefined;
  }

  const isNamed = parameterFormat === 'NAMED';

  if (isNamed && parameters.some((parameter) => !parameter.name)) {
    throw new Error('Every parameter needs a name for a template with named parameters');
  }

  return [
    {
      type: 'body',
      parameters: parameters.map((parameter) => ({
        type: 'text' as const,
        text: parameter.value,
        ...(isNamed ? { parameter_name: parameter.name } : {}),
      })),
    },
  ];
};
