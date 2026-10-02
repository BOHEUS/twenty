import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';
import { DEFAULT_BRAND } from 'twenty-shared/constants';
import { type Brand } from 'twenty-shared/types';

export const brandState = createAtomState<Brand>({
  key: 'brandState',
  defaultValue: DEFAULT_BRAND,
});
