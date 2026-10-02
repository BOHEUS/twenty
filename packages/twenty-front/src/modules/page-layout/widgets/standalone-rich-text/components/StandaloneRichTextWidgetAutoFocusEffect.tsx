import { useEffect } from 'react';

type StandaloneRichTextWidgetAutoFocusEffectProps = {
  shouldFocus: boolean;
  focusEditor: () => void;
  containerElement?: HTMLElement | null;
};

export const StandaloneRichTextWidgetAutoFocusEffect = ({
  shouldFocus,
  focusEditor,
  containerElement,
}: StandaloneRichTextWidgetAutoFocusEffectProps) => {
  useEffect(() => {
    if (shouldFocus) {
      const alreadyFocused =
        containerElement?.contains(document.activeElement) ?? false;

      if (!alreadyFocused) {
        const rafId = requestAnimationFrame(() => {
          focusEditor();
        });

        return () => {
          cancelAnimationFrame(rafId);
        };
      }
    }
  }, [shouldFocus, focusEditor, containerElement]);

  return null;
};
