import { RichTextColorIcon } from '@/advanced-text-editor/components/RichTextColorIcon';
import { RICH_TEXT_COLOR_DISPLAY_NAMES } from '@/advanced-text-editor/constants/RichTextColorDisplayNames';
import { RICH_TEXT_COLOR_NAMES } from '@/advanced-text-editor/constants/RichTextColorNames';
import { type RichTextColorName } from '@/advanced-text-editor/types/RichTextColorName';
import { isRichTextColorName } from '@/advanced-text-editor/utils/isRichTextColorName';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownRoot } from '@/ui/layout/dropdown/components/DropdownRoot';
import { i18n } from '@lingui/core';
import { useLingui } from '@lingui/react/macro';
import { type Editor } from '@tiptap/core';
import { useId } from 'react';
import { TIPTAP_MARK_TYPES } from 'twenty-shared/utils';
import { Dropdown, LightIconButton } from 'twenty-ui/components';
import { useTheme } from 'twenty-ui/theme';

type RichTextColorDropdownProps = {
  editor: Editor;
};

const getActiveColor = (
  editor: Editor,
  markType: string,
): RichTextColorName | undefined => {
  const color = editor.getAttributes(markType).color;

  return isRichTextColorName(color) ? color : undefined;
};

export const RichTextColorDropdown = ({
  editor,
}: RichTextColorDropdownProps) => {
  const { t } = useLingui();
  const theme = useTheme();
  const instanceId = useId();

  const activeTextColor = getActiveColor(editor, TIPTAP_MARK_TYPES.TEXT_STYLE);
  const activeBackgroundColor = getActiveColor(
    editor,
    TIPTAP_MARK_TYPES.HIGHLIGHT,
  );

  const handleTextColorSelect = (color: RichTextColorName | undefined) => {
    const chain = editor.chain().focus();

    (isRichTextColorName(color) ? chain.setColor(color) : chain.unsetColor())
      .removeEmptyTextStyle()
      .run();
  };

  const handleBackgroundColorSelect = (
    color: RichTextColorName | undefined,
  ) => {
    const chain = editor.chain().focus();

    (isRichTextColorName(color)
      ? chain.setHighlight({ color })
      : chain.unsetHighlight()
    ).run();
  };

  const colorOptions: (RichTextColorName | undefined)[] = [
    undefined,
    ...RICH_TEXT_COLOR_NAMES,
  ];

  const getColorLabel = (color: RichTextColorName | undefined) =>
    isRichTextColorName(color)
      ? i18n._(RICH_TEXT_COLOR_DISPLAY_NAMES[color])
      : t`Default`;

  return (
    <DropdownRoot
      dropdownId={`rich-text-color-dropdown-${instanceId}`}
      type="picker"
    >
      <Dropdown.Trigger
        render={
          <LightIconButton
            size="sm"
            emphasis="subtle"
            aria-label={t`Text and background colors`}
          >
            <RichTextColorIcon
              textColor={activeTextColor}
              backgroundColor={activeBackgroundColor}
            />
          </LightIconButton>
        }
      />
      <DropdownContent
        align="end"
        sideOffset={parseInt(theme.spacing[1], 10)}
        finalFocus={() => editor.view.dom}
        aria-label={t`Text and background colors`}
      >
        <Dropdown.Section label={t`Text Colors`}>
          {colorOptions.map((color) => (
            <Dropdown.OptionItem
              key={`text-${color ?? 'default'}`}
              selected={activeTextColor === color}
              startIcon={<RichTextColorIcon textColor={color} />}
              onSelect={() => handleTextColorSelect(color)}
            >
              {getColorLabel(color)}
            </Dropdown.OptionItem>
          ))}
        </Dropdown.Section>
        <Dropdown.Separator />
        <Dropdown.Section label={t`Background Colors`}>
          {colorOptions.map((color) => (
            <Dropdown.OptionItem
              key={`background-${color ?? 'default'}`}
              selected={activeBackgroundColor === color}
              startIcon={<RichTextColorIcon backgroundColor={color} />}
              onSelect={() => handleBackgroundColorSelect(color)}
            >
              {getColorLabel(color)}
            </Dropdown.OptionItem>
          ))}
        </Dropdown.Section>
      </DropdownContent>
    </DropdownRoot>
  );
};
