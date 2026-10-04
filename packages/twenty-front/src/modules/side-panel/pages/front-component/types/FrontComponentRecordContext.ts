import { type FrontComponentFieldContext } from 'twenty-sdk/front-component';

export type FrontComponentRecordContext = {
  objectNameSingular: string;
  recordId?: string;
  fieldContext?: FrontComponentFieldContext;
};
