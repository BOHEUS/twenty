import { type SelectOptionMeta } from 'src/logic-functions/types/select-option-meta';

export const SIZE_RANGE_OPTIONS: readonly SelectOptionMeta[] = [
  {
    key: 'size1To10',
    value: 'SIZE_1_10',
    label: '1-10',
    color: 'gray',
    position: 0,
  },
  {
    key: 'size11To50',
    value: 'SIZE_11_50',
    label: '11-50',
    color: 'bronze',
    position: 1,
  },
  {
    key: 'size51To200',
    value: 'SIZE_51_200',
    label: '51-200',
    color: 'amber',
    position: 2,
  },
  {
    key: 'size201To500',
    value: 'SIZE_201_500',
    label: '201-500',
    color: 'lime',
    position: 3,
  },
  {
    key: 'size501To1000',
    value: 'SIZE_501_1000',
    label: '501-1000',
    color: 'green',
    position: 4,
  },
  {
    key: 'size1001To5000',
    value: 'SIZE_1001_5000',
    label: '1001-5000',
    color: 'turquoise',
    position: 5,
  },
  {
    key: 'size5001To10000',
    value: 'SIZE_5001_10000',
    label: '5001-10000',
    color: 'blue',
    position: 6,
  },
  {
    key: 'size10001Plus',
    value: 'SIZE_10001_PLUS',
    label: '10001+',
    color: 'violet',
    position: 7,
  },
];
