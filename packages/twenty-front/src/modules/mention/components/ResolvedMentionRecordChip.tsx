import { allowRequestsToTwentyIconsState } from '@/client-config/states/allowRequestsToTwentyIcons';
import { MentionRecordChip } from '@/mention/components/MentionRecordChip';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { getImageIdentifierFieldMetadataItem } from '@/object-metadata/utils/getImageIdentifierFieldMetadataItem';
import { getLabelIdentifierFieldMetadataItem } from '@/object-metadata/utils/getLabelIdentifierFieldMetadataItem';
import { getObjectRecordIdentifier } from '@/object-metadata/utils/getObjectRecordIdentifier';
import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isDefined } from 'twenty-shared/utils';

type ResolvedMentionRecordChipProps = {
  recordId: string;
  objectNameSingular: string;
};

// Rich text stores mention ids only, so the label is read with the viewer's
// own permissions and stays hidden for records they cannot see.
export const ResolvedMentionRecordChip = ({
  recordId,
  objectNameSingular,
}: ResolvedMentionRecordChipProps) => {
  const allowRequestsToTwentyIcons = useAtomStateValue(
    allowRequestsToTwentyIconsState,
  );
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const labelIdentifierFieldName =
    getLabelIdentifierFieldMetadataItem(objectMetadataItem)?.name;
  const imageIdentifierFieldName =
    getImageIdentifierFieldMetadataItem(objectMetadataItem)?.name;

  const { record } = useFindOneRecord({
    objectNameSingular,
    objectRecordId: recordId,
    recordGqlFields: {
      id: true,
      ...(isDefined(labelIdentifierFieldName)
        ? { [labelIdentifierFieldName]: true }
        : {}),
      ...(isDefined(imageIdentifierFieldName)
        ? { [imageIdentifierFieldName]: true }
        : {}),
    },
  });

  const recordIdentifier = isDefined(record)
    ? getObjectRecordIdentifier({
        objectMetadataItem,
        record,
        allowRequestsToTwentyIcons,
      })
    : undefined;

  return (
    <MentionRecordChip
      recordId={recordId}
      objectNameSingular={objectNameSingular}
      label={recordIdentifier?.name ?? ''}
      imageUrl={recordIdentifier?.avatarUrl ?? ''}
    />
  );
};
