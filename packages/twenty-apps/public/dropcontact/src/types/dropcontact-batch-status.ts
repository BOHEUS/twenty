import { type DropcontactPersonData } from 'src/types/dropcontact-person-data';

export type DropcontactBatchStatus =
  | { status: 'ready'; contacts: DropcontactPersonData[] }
  | { status: 'processing' }
  | { status: 'missing' }
  | { status: 'error'; httpStatus: number; message: string };
