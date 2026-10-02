import { isNonEmptyArray } from '@sniptt/guards';
import { WorkflowActionType } from 'twenty-shared/workflow';
import { z } from 'zod';

import { type RichTextValueMapping } from 'src/database/commands/upgrade-version-command/2-45/types/rich-text-value-mapping.type';

const recordCrudStepSchema = z.object({
  type: z.enum([
    WorkflowActionType.CREATE_RECORD,
    WorkflowActionType.UPDATE_RECORD,
    WorkflowActionType.UPSERT_RECORD,
  ]),
  settings: z.object({
    input: z.object({
      objectName: z.string(),
      objectRecord: z.record(z.string(), z.unknown()),
    }),
  }),
});

export const mapRecordCrudRichTextFields = <TSteps>({
  steps,
  richTextFieldNamesByObjectName,
  mapValue,
}: {
  steps: TSteps;
  richTextFieldNamesByObjectName: Record<string, string[]>;
  mapValue: RichTextValueMapping;
}): { value: TSteps; hasChanged: boolean } => {
  if (!Array.isArray(steps)) {
    return { value: steps, hasChanged: false };
  }

  let hasChanged = false;

  const nextSteps = steps.map((step) => {
    const parsedStep = recordCrudStepSchema.safeParse(step);

    if (!parsedStep.success) {
      return step;
    }

    const { objectName, objectRecord } = parsedStep.data.settings.input;
    const richTextFieldNames = richTextFieldNamesByObjectName[objectName];

    if (!isNonEmptyArray(richTextFieldNames)) {
      return step;
    }

    let hasStepChanged = false;
    const nextObjectRecord: Record<string, unknown> = { ...objectRecord };

    for (const fieldName of richTextFieldNames) {
      const result = mapValue(nextObjectRecord[fieldName]);

      if (result.hasChanged) {
        nextObjectRecord[fieldName] = result.value;
        hasStepChanged = true;
      }
    }

    if (!hasStepChanged) {
      return step;
    }

    hasChanged = true;

    return {
      ...step,
      settings: {
        ...step.settings,
        input: { ...step.settings.input, objectRecord: nextObjectRecord },
      },
    };
  });

  return { value: hasChanged ? (nextSteps as TSteps) : steps, hasChanged };
};
