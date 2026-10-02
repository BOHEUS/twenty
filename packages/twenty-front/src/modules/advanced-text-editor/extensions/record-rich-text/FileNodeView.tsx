import { type AttachmentFileCategory } from '@/activities/files/types/AttachmentFileCategory';
import { FileIcon } from '@/file/components/FileIcon';
import { styled } from '@linaria/react';
import { isString } from '@sniptt/guards';
import { type NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { getSafeUrl } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledFileLine = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  margin-bottom: ${themeCssVariables.spacing[2]};
`;

const StyledLink = styled.a`
  color: ${themeCssVariables.font.color.primary};
  text-decoration: none;

  &:hover {
    color: ${themeCssVariables.font.color.secondary};
  }
`;

type FileNodeViewProps = NodeViewProps;

export const FileNodeView = ({ node }: FileNodeViewProps) => {
  const name = isString(node.attrs.name) ? node.attrs.name : '';
  const safeUrl = getSafeUrl(node.attrs.url);
  const fileCategory: AttachmentFileCategory = node.attrs.fileCategory;

  return (
    <NodeViewWrapper>
      <StyledFileLine contentEditable={false}>
        <FileIcon fileCategory={fileCategory} thumbnailUrl={safeUrl} />
        {safeUrl ? (
          <StyledLink href={safeUrl} target="_blank" rel="noopener noreferrer">
            {name}
          </StyledLink>
        ) : (
          <span>{name}</span>
        )}
      </StyledFileLine>
    </NodeViewWrapper>
  );
};
