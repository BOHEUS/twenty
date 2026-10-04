import { renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';

import { phonesFieldDefinition } from '@/object-record/record-field/ui/__mocks__/fieldDefinitions';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { useGetSecondaryFieldButton } from '@/object-record/record-field/ui/hooks/useGetSecondaryFieldButton';
import { type FieldDefinition } from '@/object-record/record-field/ui/types/FieldDefinition';
import { type FieldMetadata } from '@/object-record/record-field/ui/types/FieldMetadata';
import { FieldMetadataSettingsOnClickAction } from 'twenty-shared/types';

const mockOpenFieldValueCommandMenuItem = jest.fn();
let mockFieldValueCommandMenuItems: Array<{
  id: string;
  label: string;
  icon: string | null;
  frontComponentId: string;
}> = [];

jest.mock('@/command-menu-item/hooks/useFieldValueCommandMenuItems', () => ({
  useFieldValueCommandMenuItems: () => mockFieldValueCommandMenuItems,
}));

jest.mock('@/command-menu-item/hooks/useOpenFieldValueCommandMenuItem', () => ({
  useOpenFieldValueCommandMenuItem: () => ({
    openFieldValueCommandMenuItem: mockOpenFieldValueCommandMenuItem,
  }),
}));

jest.mock('@/activities/emails/hooks/useOpenEmailInAppOrFallback', () => ({
  useOpenEmailInAppOrFallback: () => ({ openEmail: jest.fn() }),
}));

jest.mock('~/hooks/useCopyToClipboard', () => ({
  useCopyToClipboard: () => ({ copyToClipboard: jest.fn() }),
}));

const phonesValue = {
  primaryPhoneNumber: '612345678',
  primaryPhoneCallingCode: '+33',
  primaryPhoneCountryCode: 'FR',
  additionalPhones: [],
};

jest.mock('@/object-record/record-store/hooks/useRecordFieldValue', () => ({
  useRecordFieldValue: () => phonesValue,
}));

const getWrapper =
  (fieldDefinition: FieldDefinition<FieldMetadata>) =>
  ({ children }: { children: ReactNode }) => (
    <FieldContext.Provider
      value={{
        fieldDefinition,
        recordId: 'record-id',
        isLabelIdentifier: false,
        isRecordFieldReadOnly: false,
      }}
    >
      {children}
    </FieldContext.Provider>
  );

const withClickAction = (clickAction: FieldMetadataSettingsOnClickAction) =>
  ({
    ...phonesFieldDefinition,
    metadata: {
      ...phonesFieldDefinition.metadata,
      settings: { clickAction },
    },
  }) as FieldDefinition<FieldMetadata>;

describe('useGetSecondaryFieldButton', () => {
  beforeEach(() => {
    mockOpenFieldValueCommandMenuItem.mockClear();
    mockFieldValueCommandMenuItems = [];
  });

  it('returns only the copy button when no app provides a phone command', () => {
    const { result } = renderHook(() => useGetSecondaryFieldButton(), {
      wrapper: getWrapper(phonesFieldDefinition),
    });

    expect(result.current.map((button) => button.ariaLabel)).toEqual(['Copy']);
  });

  it('adds one button per field value command', () => {
    mockFieldValueCommandMenuItems = [
      {
        id: 'dialer',
        label: 'Call with Dialer',
        icon: null,
        frontComponentId: 'fc-1',
      },
      {
        id: 'whatsapp',
        label: 'Call on WhatsApp',
        icon: null,
        frontComponentId: 'fc-2',
      },
    ];

    const { result } = renderHook(() => useGetSecondaryFieldButton(), {
      wrapper: getWrapper(phonesFieldDefinition),
    });

    expect(result.current.map((button) => button.ariaLabel)).toEqual([
      'Copy',
      'Call with Dialer',
      'Call on WhatsApp',
    ]);

    result.current[2].onClick();

    expect(mockOpenFieldValueCommandMenuItem).toHaveBeenCalledWith({
      item: mockFieldValueCommandMenuItems[1],
      value: phonesValue,
    });
  });

  it('binds the first command to open in app and keeps the others', () => {
    mockFieldValueCommandMenuItems = [
      {
        id: 'dialer',
        label: 'Call with Dialer',
        icon: null,
        frontComponentId: 'fc-1',
      },
      {
        id: 'whatsapp',
        label: 'Call on WhatsApp',
        icon: null,
        frontComponentId: 'fc-2',
      },
    ];

    const { result } = renderHook(() => useGetSecondaryFieldButton(), {
      wrapper: getWrapper(
        withClickAction(FieldMetadataSettingsOnClickAction.OPEN_IN_APP),
      ),
    });

    expect(result.current.map((button) => button.ariaLabel)).toEqual([
      'Copy',
      'Call on WhatsApp',
    ]);
  });

  it('keeps command buttons when open in app is not the secondary action', () => {
    mockFieldValueCommandMenuItems = [
      {
        id: 'dialer',
        label: 'Call with Dialer',
        icon: null,
        frontComponentId: 'fc-1',
      },
    ];

    const { result } = renderHook(() => useGetSecondaryFieldButton(), {
      wrapper: getWrapper(
        withClickAction(FieldMetadataSettingsOnClickAction.COPY),
      ),
    });

    expect(result.current.map((button) => button.ariaLabel)).toEqual([
      'Open link',
      'Call with Dialer',
    ]);
  });
});
