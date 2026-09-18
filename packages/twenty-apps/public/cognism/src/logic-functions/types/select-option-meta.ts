import { type TagColor } from 'src/logic-functions/types/tag-color';

export type SelectOptionMeta = {
  key: string;
  value: string;
  label: string;
  color: TagColor;
  position: number;
};
