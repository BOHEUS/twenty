import { type AmplemarketContactType } from 'src/types/amplemarket-contact-type';

export const CONTACT_DETAIL_OPTIONS: {
  label: string;
  value: AmplemarketContactType;
}[] = [
  { label: 'Email', value: 'email' },
  { label: 'Phone numbers', value: 'phone' },
];
