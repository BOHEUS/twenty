import { type NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import { isNonEmptyString } from '@sniptt/guards';

import { MentionRecordChip } from '@/mention/components/MentionRecordChip';
import { ResolvedMentionRecordChip } from '@/mention/components/ResolvedMentionRecordChip';

type MentionChipProps = Pick<NodeViewProps, 'node'>;

export const MentionChip = ({ node }: MentionChipProps) => {
  const recordId = node.attrs.recordId as string;
  const objectNameSingular = node.attrs.objectNameSingular as string;
  const label = node.attrs.label as string;
  const imageUrl = (node.attrs.imageUrl as string) ?? '';

  const shouldResolveLabel =
    !isNonEmptyString(label) &&
    isNonEmptyString(recordId) &&
    isNonEmptyString(objectNameSingular);

  return (
    <NodeViewWrapper as="span" style={{ display: 'inline' }}>
      {shouldResolveLabel ? (
        <ResolvedMentionRecordChip
          recordId={recordId}
          objectNameSingular={objectNameSingular}
        />
      ) : (
        <MentionRecordChip
          recordId={recordId}
          objectNameSingular={objectNameSingular}
          label={label}
          imageUrl={imageUrl}
        />
      )}
    </NodeViewWrapper>
  );
};
