import { type RichTextColorName } from '@/advanced-text-editor/types/RichTextColorName';
import { styled } from '@linaria/react';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledColorIcon = styled.div<{
  textColorValue: string;
  backgroundColorValue: string;
}>`
  background-color: ${({ backgroundColorValue }) => backgroundColorValue};
  border-radius: ${themeCssVariables.border.radius.xs};
  color: ${({ textColorValue }) => textColorValue};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  height: 16px;
  line-height: 16px;
  pointer-events: none;
  text-align: center;
  width: 16px;
`;

type RichTextColorIconProps = {
  textColor?: RichTextColorName;
  backgroundColor?: RichTextColorName;
};

export const RichTextColorIcon = ({
  textColor,
  backgroundColor,
}: RichTextColorIconProps) => (
  <StyledColorIcon
    textColorValue={
      isDefined(textColor) ? themeCssVariables.tag.text[textColor] : 'inherit'
    }
    backgroundColorValue={
      isDefined(backgroundColor)
        ? themeCssVariables.tag.background[backgroundColor]
        : 'transparent'
    }
  >
    A
  </StyledColorIcon>
);
