import { isNonEmptyString } from '@sniptt/guards';
import { type EmailAttachment } from 'twenty-shared/types';
import { isDefined, resolveInput } from 'twenty-shared/utils';
import { type WorkflowAttachment } from 'twenty-shared/workflow';

import { type FileOutput } from 'src/engine/api/common/common-args-processors/data-arg-processor/types/file-item.type';

// Labels usually already hold the full uploaded filename
const buildFilesFieldItemName = ({ label, extension }: FileOutput): string => {
  if (!isNonEmptyString(label)) {
    return '';
  }

  if (
    !isNonEmptyString(extension) ||
    label.toLowerCase().endsWith(extension.toLowerCase())
  ) {
    return label;
  }

  return `${label}${extension}`;
};

export const resolveEmailFiles = (
  files: unknown,
  context: Record<string, unknown>,
): EmailAttachment[] => {
  const resolvedFiles = resolveInput(files, context);

  if (!Array.isArray(resolvedFiles)) {
    return [];
  }

  return resolvedFiles
    .flat()
    .map((file): EmailAttachment | undefined => {
      if (!isDefined(file) || typeof file !== 'object') {
        return undefined;
      }

      const attachment = file as WorkflowAttachment | FileOutput;
      const id = 'id' in attachment ? attachment.id : attachment.fileId;

      if (!isNonEmptyString(id)) {
        return undefined;
      }

      const name =
        'id' in attachment
          ? attachment.name
          : buildFilesFieldItemName(attachment);

      return { id, name: isNonEmptyString(name) ? name : id };
    })
    .filter(isDefined);
};
