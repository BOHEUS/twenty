import { isDDLLockedState } from '@/client-config/states/isDDLLockedState';
import { useUpdateOneObjectMetadataItem } from '@/object-metadata/hooks/useUpdateOneObjectMetadataItem';
import { useUpdateObjectSearchableFields } from '@/object-metadata/hooks/useUpdateObjectSearchableFields';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { SEARCH_VECTOR_FIELD_NAME } from '@/object-record/constants/SearchVectorFieldName';
import { SettingsOptionCardContentToggle } from '@/settings/components/SettingsOptions/SettingsOptionCardContentToggle';
import { SettingsObjectFieldDataType } from '@/settings/data-model/object-details/components/SettingsObjectFieldDataType';
import { type SettingsFieldType } from '@/settings/data-model/types/SettingsFieldType';
import { Select } from '@/ui/input/components/Select';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { Table } from '@/ui/layout/table/components/Table';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useContext, useMemo, useState } from 'react';
import { isDefined, isSearchableFieldType } from 'twenty-shared/utils';
import { IconEye, IconSearch, IconX, useIcons } from 'twenty-ui/display';
import { LightIconButton, type SelectOption } from 'twenty-ui/input';
import { Card } from 'twenty-ui/layout';
import { ThemeContext, themeCssVariables } from 'twenty-ui/theme-constants';

type SettingsObjectSearchSectionProps = {
  objectMetadataItem: EnrichedObjectMetadataItem;
  isReadOnly: boolean;
};

type SearchVectorSettings = {
  asExpression?: string;
  searchFieldMetadataIds?: string[];
} | null;

type SearchFieldEntry = {
  id: string;
  label: string;
  icon?: string | null;
  fieldType: string;
};

const StyledSearchSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

const StyledNameLabel = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SEARCH_FIELD_PICKER_DROPDOWN_ID = 'object-search-field-picker';

const SEARCH_FIELDS_GRID_TEMPLATE_COLUMNS = 'minmax(0, 1fr) 148px 32px';

// Fallback for searchVector fields that predate the configurable searchable
// fields feature: recover the included field ids from the generated
// asExpression by matching quoted column names back to fields.
const deriveSearchFieldIdsFromAsExpression = (
  objectMetadataItem: EnrichedObjectMetadataItem,
  asExpression: string | undefined,
): string[] => {
  if (!isDefined(asExpression)) {
    return [];
  }

  const columnNames = [
    ...new Set(
      Array.from(asExpression.matchAll(/"([^"]+)"/g), (match) => match[1]),
    ),
  ];

  const candidateFields = [...objectMetadataItem.fields]
    .filter(
      (field) =>
        field.name !== SEARCH_VECTOR_FIELD_NAME &&
        isSearchableFieldType(field.type),
    )
    .sort((a, b) => b.name.length - a.name.length);

  const includedFieldIds: string[] = [];
  const seenFieldIds = new Set<string>();

  for (const columnName of columnNames) {
    const matchingField = candidateFields.find(
      (field) => columnName === field.name || columnName.startsWith(field.name),
    );

    if (isDefined(matchingField) && !seenFieldIds.has(matchingField.id)) {
      seenFieldIds.add(matchingField.id);
      includedFieldIds.push(matchingField.id);
    }
  }

  return includedFieldIds;
};

const getSearchFieldMetadataIds = (
  objectMetadataItem: EnrichedObjectMetadataItem,
): string[] => {
  const searchVectorField = objectMetadataItem.fields.find(
    (field) => field.name === SEARCH_VECTOR_FIELD_NAME,
  );

  const settings = searchVectorField?.settings as SearchVectorSettings;

  if (isDefined(settings?.searchFieldMetadataIds)) {
    return settings.searchFieldMetadataIds;
  }

  return deriveSearchFieldIdsFromAsExpression(
    objectMetadataItem,
    settings?.asExpression,
  );
};

const isFieldEligibleForSearch = (field: FieldMetadataItem): boolean =>
  field.name !== SEARCH_VECTOR_FIELD_NAME &&
  field.isActive === true &&
  field.isSystem !== true &&
  isSearchableFieldType(field.type);

export const SettingsObjectSearchSection = ({
  objectMetadataItem,
  isReadOnly,
}: SettingsObjectSearchSectionProps) => {
  const { t } = useLingui();
  const { getIcon } = useIcons();
  const { theme } = useContext(ThemeContext);
  const { updateOneObjectMetadataItem } = useUpdateOneObjectMetadataItem();
  const { updateObjectSearchableFields, loading } =
    useUpdateObjectSearchableFields();
  const isDDLLocked = useAtomStateValue(isDDLLockedState);

  const [isSearchable, setIsSearchable] = useState(
    objectMetadataItem.isSearchable,
  );
  const [searchTerm, setSearchTerm] = useState('');

  const isEditingDisabled = isReadOnly || isDDLLocked || loading;

  const searchFieldMetadataIds = useMemo(
    () => getSearchFieldMetadataIds(objectMetadataItem),
    [objectMetadataItem],
  );

  const searchFieldEntries = useMemo<SearchFieldEntry[]>(
    () =>
      searchFieldMetadataIds
        .map((fieldId) =>
          objectMetadataItem.fields.find((field) => field.id === fieldId),
        )
        .filter(isDefined)
        .map((field) => ({
          id: field.id,
          label: field.label,
          icon: field.icon,
          fieldType: field.type,
        })),
    [searchFieldMetadataIds, objectMetadataItem],
  );

  const availableFieldOptions = useMemo<SelectOption<string>[]>(
    () =>
      objectMetadataItem.fields
        .filter(
          (field) =>
            isFieldEligibleForSearch(field) &&
            !searchFieldMetadataIds.includes(field.id),
        )
        .map((field) => ({
          value: field.id,
          label: field.label,
          Icon: getIcon(field.icon),
        })),
    [objectMetadataItem, searchFieldMetadataIds, getIcon],
  );

  const filteredSearchFieldEntries = searchTerm
    ? searchFieldEntries.filter((entry) =>
        entry.label.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : searchFieldEntries;

  const handleToggleSearchable = async (value: boolean) => {
    setIsSearchable(value);
    await updateOneObjectMetadataItem({
      idToUpdate: objectMetadataItem.id,
      updatePayload: { isSearchable: value },
    });
  };

  const handleAddSearchField = async (fieldId: string) => {
    await updateObjectSearchableFields({
      objectMetadataId: objectMetadataItem.id,
      fieldMetadataIds: [...searchFieldMetadataIds, fieldId],
    });
  };

  const handleRemoveSearchField = async (fieldId: string) => {
    await updateObjectSearchableFields({
      objectMetadataId: objectMetadataItem.id,
      fieldMetadataIds: searchFieldMetadataIds.filter((id) => id !== fieldId),
    });
  };

  return (
    <StyledSearchSectionContent>
      {!isReadOnly && (
        <Card rounded>
          <SettingsOptionCardContentToggle
            Icon={IconEye}
            title={t`Global search`}
            description={t`Show this object's records in the command menu (⌘K).`}
            checked={isSearchable}
            advancedMode
            onChange={handleToggleSearchable}
          />
        </Card>
      )}
      {searchFieldEntries.length > 0 && (
        <>
          <SettingsTextInput
            instanceId="indexed-fields-search"
            LeftIcon={IconSearch}
            placeholder={t`Search across indexed fields...`}
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <Table>
            <TableRow gridTemplateColumns={SEARCH_FIELDS_GRID_TEMPLATE_COLUMNS}>
              <TableHeader>{t`Name`}</TableHeader>
              <TableHeader>{t`Data type`}</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
            {filteredSearchFieldEntries.map((entry) => {
              const FieldIcon = getIcon(entry.icon);

              return (
                <TableRow
                  key={entry.id}
                  gridTemplateColumns={SEARCH_FIELDS_GRID_TEMPLATE_COLUMNS}
                >
                  <TableCell
                    color={theme.font.color.primary}
                    gap={theme.spacing[2]}
                  >
                    <FieldIcon
                      size={theme.icon.size.md}
                      stroke={theme.icon.stroke.sm}
                    />
                    <StyledNameLabel>{entry.label}</StyledNameLabel>
                  </TableCell>
                  <TableCell>
                    <SettingsObjectFieldDataType
                      value={entry.fieldType as SettingsFieldType}
                    />
                  </TableCell>
                  <TableCell>
                    {!isReadOnly && (
                      <LightIconButton
                        Icon={IconX}
                        accent="tertiary"
                        disabled={isEditingDisabled}
                        onClick={() => handleRemoveSearchField(entry.id)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>
        </>
      )}
      {!isReadOnly && availableFieldOptions.length > 0 && (
        <Select
          dropdownId={SEARCH_FIELD_PICKER_DROPDOWN_ID}
          options={availableFieldOptions}
          emptyOption={{ label: t`Add a field…`, value: '' }}
          value=""
          disabled={isEditingDisabled}
          fullWidth
          onChange={(fieldId) => {
            if (isDefined(fieldId) && fieldId !== '') {
              handleAddSearchField(fieldId);
            }
          }}
        />
      )}
    </StyledSearchSectionContent>
  );
};
