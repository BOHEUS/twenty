import { isRichTextColorName } from '@/advanced-text-editor/utils/isRichTextColorName';
import { Color } from '@tiptap/extension-text-style';
import { TIPTAP_MARK_TYPES } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme';

// Stores palette names instead of CSS colors so documents follow the theme.
export const RichTextTextColor = Color.extend({
  addGlobalAttributes() {
    return [
      {
        types: [TIPTAP_MARK_TYPES.TEXT_STYLE],
        attributes: {
          color: {
            default: null,
            parseHTML: (element) => element.getAttribute('data-text-color'),
            renderHTML: (attributes) =>
              isRichTextColorName(attributes.color)
                ? {
                    'data-text-color': attributes.color,
                    style: `color: ${themeCssVariables.tag.text[attributes.color]}`,
                  }
                : {},
          },
        },
      },
    ];
  },
});
