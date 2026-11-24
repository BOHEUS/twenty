import { recordTableWidgetViewDraftComponentState } from '@/page-layout/states/recordTableWidgetViewDraftComponentState';
import { getRecordTableWidgetDraftViewFieldClientId } from '@/page-layout/widgets/record-table/utils/getRecordTableWidgetDraftViewFieldClientId';
import { useAtomComponentStateCallbackState } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateCallbackState';
import { type ViewField } from '@/views/types/ViewField';
import { useStore } from 'jotai';
import { useCallback } from 'react';
import { isDefined } from 'twenty-shared/utils';

type UseToggleRecordTableWidgetFieldVisibilityParams = {
  pageLayoutId: string;
  widgetId: string;
};

export const useToggleRecordTableWidgetFieldVisibility = ({
  pageLayoutId,
  widgetId,
}: UseToggleRecordTableWidgetFieldVisibilityParams) => {
  const recordTableWidgetViewDraftState = useAtomComponentStateCallbackState(
    recordTableWidgetViewDraftComponentState,
    pageLayoutId,
  );

  const store = useStore();

  const toggleRecordTableWidgetFieldVisibility = useCallback(
    (viewField: ViewField, isVisible: boolean) => {
      store.set(recordTableWidgetViewDraftState, (prev) => {
        const widgetViewDraft = prev[widgetId];

        if (!isDefined(widgetViewDraft)) {
          return prev;
        }

        const isViewFieldInDraft = widgetViewDraft.viewFields.some(
          (field) =>
            getRecordTableWidgetDraftViewFieldClientId(field) === viewField.id,
        );

        const viewFields = isViewFieldInDraft
          ? widgetViewDraft.viewFields.map((field) =>
              getRecordTableWidgetDraftViewFieldClientId(field) === viewField.id
                ? { ...field, isVisible }
                : field,
            )
          : [
              ...widgetViewDraft.viewFields,
              {
                fieldMetadataId: viewField.fieldMetadataId,
                position: viewField.position,
                size: viewField.size,
                isActive: true,
                isVisible,
                viewId: widgetViewDraft.view.id,
                clientRecordFieldId: viewField.id,
              },
            ];

        return {
          ...prev,
          [widgetId]: { ...widgetViewDraft, viewFields },
        };
      });
    },
    [store, recordTableWidgetViewDraftState, widgetId],
  );

  return { toggleRecordTableWidgetFieldVisibility };
};
