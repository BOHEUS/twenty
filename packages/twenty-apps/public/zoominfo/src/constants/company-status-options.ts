import { type SelectOptionMeta } from 'src/types/select-option-meta';

export const COMPANY_STATUS_OPTIONS: readonly SelectOptionMeta[] = [
  { key: 'alive', value: 'ALIVE', label: 'Alive', color: 'green', position: 0 },
  { key: 'new', value: 'NEW', label: 'New', color: 'blue', position: 1 },
  {
    key: 'defunctDomainDown',
    value: 'DEFUNCT_DOMAIN_DOWN',
    label: 'Defunct - Domain Down',
    color: 'red',
    position: 2,
  },
  {
    key: 'defunctDeclaration',
    value: 'DEFUNCT_DECLARATION',
    label: 'Defunct - Declared',
    color: 'red',
    position: 3,
  },
  {
    key: 'defunctManual',
    value: 'DEFUNCT_MANUAL',
    label: 'Defunct - Manual',
    color: 'red',
    position: 4,
  },
  {
    key: 'defunctFormerName',
    value: 'DEFUNCT_FORMER_NAME',
    label: 'Defunct - Former Name',
    color: 'orange',
    position: 5,
  },
  {
    key: 'defunctAcquisition',
    value: 'DEFUNCT_ACQUISITION',
    label: 'Defunct - Acquired',
    color: 'amber',
    position: 6,
  },
];
