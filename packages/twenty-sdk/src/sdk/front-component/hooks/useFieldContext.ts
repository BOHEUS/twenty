import { type FrontComponentExecutionContext } from '../types/FrontComponentExecutionContext';
import { type FrontComponentFieldContext } from '../types/FrontComponentFieldContext';
import { useFrontComponentExecutionContext } from './useFrontComponentExecutionContext';

const selectFieldContext = (
  context: FrontComponentExecutionContext,
): FrontComponentFieldContext | null => context.fieldContext ?? null;

export const useFieldContext = (): FrontComponentFieldContext | null => {
  return useFrontComponentExecutionContext(selectFieldContext);
};
