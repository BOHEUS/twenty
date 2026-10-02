import { useRef } from 'react';

import { useIsPageLayoutInEditMode } from '@/page-layout/hooks/useIsPageLayoutInEditMode';
import { pageLayoutEditingWidgetIdComponentState } from '@/page-layout/states/pageLayoutEditingWidgetIdComponentState';
import { type PageLayoutWidget } from '@/page-layout/types/PageLayoutWidget';
import { TiptapStandaloneRichTextEditorContent } from '@/page-layout/widgets/standalone-rich-text/components/TiptapStandaloneRichTextEditorContent';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { FeatureFlagKey } from 'twenty-shared/types';
import { StandaloneRichTextEditorContent } from '@/page-layout/widgets/standalone-rich-text/components/StandaloneRichTextEditorContent';
import { ScrollWrapper } from '@/ui/utilities/scroll/components/ScrollWrapper';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { styled } from '@linaria/react';
import { type StandaloneRichTextConfiguration } from '~/generated-metadata/graphql';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledContainer = styled.div<{ isPageLayoutInEditMode?: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding-left: ${({ isPageLayoutInEditMode }) =>
    isPageLayoutInEditMode ? themeCssVariables.spacing[5] : 0};
  width: 100%;
`;

type StandaloneRichTextWidgetProps = {
  widget: PageLayoutWidget;
};

export const StandaloneRichTextWidget = ({
  widget,
}: StandaloneRichTextWidgetProps) => {
  const containerElementRef = useRef<HTMLDivElement>(null);
  const isPageLayoutInEditMode = useIsPageLayoutInEditMode();

  const pageLayoutEditingWidgetId = useAtomComponentStateValue(
    pageLayoutEditingWidgetIdComponentState,
  );

  const configuration = widget.configuration as
    | StandaloneRichTextConfiguration
    | undefined;

  const currentBody = configuration?.body?.blocknote ?? '';

  const isTiptapRichTextEditorEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_TIPTAP_RICH_TEXT_EDITOR_ENABLED,
  );

  const isThisWidgetBeingEdited = pageLayoutEditingWidgetId === widget.id;
  const isEditable = isPageLayoutInEditMode;

  return (
    <StyledContainer
      ref={containerElementRef}
      isPageLayoutInEditMode={isPageLayoutInEditMode}
    >
      <ScrollWrapper
        componentInstanceId={`scroll-wrapper-rich-text-widget-${widget.id}`}
      >
        {isTiptapRichTextEditorEnabled ? (
          <TiptapStandaloneRichTextEditorContent
            key={isEditable ? 'editing' : 'readonly'}
            widget={widget}
            body={configuration?.body}
            isEditable={isEditable}
            shouldFocus={isEditable && isThisWidgetBeingEdited}
            containerElement={containerElementRef.current}
          />
        ) : (
          <StandaloneRichTextEditorContent
            key={isEditable ? 'editing' : 'readonly'}
            widget={widget}
            currentBody={currentBody}
            isEditable={isEditable}
            shouldFocus={isEditable && isThisWidgetBeingEdited}
            containerElement={containerElementRef.current}
          />
        )}
      </ScrollWrapper>
    </StyledContainer>
  );
};
