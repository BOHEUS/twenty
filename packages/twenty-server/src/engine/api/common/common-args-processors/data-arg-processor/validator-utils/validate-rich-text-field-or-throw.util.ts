import { inspect } from 'util';

import { msg } from '@lingui/core/macro';
import { isNonEmptyString, isNull } from '@sniptt/guards';
import { isDefined } from 'twenty-shared/utils';

import { type RichTextDocumentViolation } from 'src/engine/api/common/common-args-processors/data-arg-processor/types/rich-text-document-violation.type';
import { findBlockNoteDocumentViolation } from 'src/engine/api/common/common-args-processors/data-arg-processor/utils/find-blocknote-document-violation.util';
import { findTipTapDocumentViolation } from 'src/engine/api/common/common-args-processors/data-arg-processor/utils/find-tiptap-document-violation.util';
import { validateRawJsonFieldOrThrow } from 'src/engine/api/common/common-args-processors/data-arg-processor/validator-utils/validate-raw-json-field-or-throw.util';
import { validateTextFieldOrThrow } from 'src/engine/api/common/common-args-processors/data-arg-processor/validator-utils/validate-text-field-or-throw.util';
import {
  CommonQueryRunnerException,
  CommonQueryRunnerExceptionCode,
} from 'src/engine/api/common/common-query-runners/errors/common-query-runner.exception';

type RichTextFieldValue = {
  blocknote?: string | null;
  markdown?: string | null;
  tiptap?: string | null;
};

const RICH_TEXT_DOCUMENT_VIOLATION_MESSAGES: Record<
  RichTextDocumentViolation,
  string
> = {
  invalidShape: 'has an invalid structure',
  unsupportedNode: 'contains a node type that is not allowed',
  unsupportedMark: 'contains a mark type that is not allowed',
  unsafeUrl: 'contains a URL with a dangerous protocol',
  tooDeep: 'is nested too deeply',
  tooLarge: 'contains too many nodes',
};

const throwInvalidRichTextValue = (message: string): never => {
  throw new CommonQueryRunnerException(
    message,
    CommonQueryRunnerExceptionCode.INVALID_ARGS_DATA,
    { userFriendlyMessage: msg`Invalid value for rich text.` },
  );
};

const validateSerializedDocumentOrThrow = ({
  value,
  fieldName,
  findViolation,
}: {
  value: unknown;
  fieldName: string;
  findViolation: (document: unknown) => RichTextDocumentViolation | undefined;
}): string | null => {
  const textValue = validateTextFieldOrThrow(value, fieldName);

  if (!isNonEmptyString(textValue)) return textValue;

  let parsed: unknown;

  try {
    parsed = JSON.parse(textValue);
  } catch {
    return throwInvalidRichTextValue(
      `Invalid value for field "${fieldName}" - must contain valid JSON`,
    );
  }

  const violation = findViolation(parsed);

  if (!isDefined(violation)) {
    return textValue;
  }

  const message = `Invalid value for field "${fieldName}" - ${RICH_TEXT_DOCUMENT_VIOLATION_MESSAGES[violation]}`;

  if (violation === 'unsafeUrl') {
    throw new CommonQueryRunnerException(
      message,
      CommonQueryRunnerExceptionCode.INVALID_ARGS_DATA,
      {
        userFriendlyMessage: msg`Content contains a URL with a dangerous protocol.`,
      },
    );
  }

  return throwInvalidRichTextValue(message);
};

export const validateRichTextFieldOrThrow = (
  value: unknown,
  fieldName: string,
): RichTextFieldValue | null => {
  const preValidatedValue = validateRawJsonFieldOrThrow(value, fieldName);

  if (isNull(preValidatedValue)) return null;

  for (const [subField, subFieldValue] of Object.entries(preValidatedValue)) {
    const subFieldName = `${fieldName}.${subField}`;

    switch (subField) {
      case 'blocknote':
        validateSerializedDocumentOrThrow({
          value: subFieldValue,
          fieldName: subFieldName,
          findViolation: findBlockNoteDocumentViolation,
        });
        break;
      case 'tiptap':
        validateSerializedDocumentOrThrow({
          value: subFieldValue,
          fieldName: subFieldName,
          findViolation: findTipTapDocumentViolation,
        });
        break;
      case 'markdown':
        validateTextFieldOrThrow(subFieldValue, subFieldName);
        break;
      default:
        throw new CommonQueryRunnerException(
          `Invalid subfield ${inspect(subField)} for rich text field "${fieldName}"`,
          CommonQueryRunnerExceptionCode.INVALID_ARGS_DATA,
          { userFriendlyMessage: msg`Invalid value for rich text.` },
        );
    }
  }

  return value as RichTextFieldValue;
};
