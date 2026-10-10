import { type SelectOption } from 'src/types/select-option';

export const buildSelectOptions = ({
  options,
  ids,
}: {
  options: readonly SelectOption[];
  ids: Record<string, string>;
}) =>
  options.map((option, position) => ({
    ...option,
    id: ids[option.value],
    position,
  }));
