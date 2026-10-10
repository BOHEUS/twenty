import { type ExploriumContactType } from 'src/types/explorium-contact-type';

export const CONTACT_DETAIL_OPTIONS: {
  label: string;
  value: ExploriumContactType;
}[] = [
  { label: 'Professional email', value: 'email' },
  { label: 'Phone numbers', value: 'phone' },
];
