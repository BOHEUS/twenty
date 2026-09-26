import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

export const mapStyleUrlsState = createAtomState<{
  light: string;
  dark: string;
} | null>({
  key: 'mapStyleUrlsState',
  defaultValue: null,
});
