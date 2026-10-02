import { isRichTextColorName } from '@/advanced-text-editor/utils/isRichTextColorName';
import { Highlight } from '@tiptap/extension-highlight';
import { themeCssVariables } from 'twenty-ui/theme';

export const RichTextHighlight = Highlight.extend({
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-background-color'),
        renderHTML: (attributes) =>
          isRichTextColorName(attributes.color)
            ? {
                'data-background-color': attributes.color,
                style: `background-color: ${themeCssVariables.tag.background[attributes.color]}; color: inherit`,
              }
            : {},
      },
    };
  },
}).configure({ multicolor: true });
