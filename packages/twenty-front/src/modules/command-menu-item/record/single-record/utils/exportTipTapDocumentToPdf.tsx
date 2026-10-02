import { TipTapPdfDocument } from '@/command-menu-item/record/single-record/components/TipTapPdfDocument';
import { collectTipTapImageSources } from '@/command-menu-item/record/single-record/utils/collectTipTapImageSources';
import { fetchPdfImageAsset } from '@/command-menu-item/record/single-record/utils/fetchPdfImageAsset';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { type TipTapDocument } from 'twenty-shared/utils';

export const exportTipTapDocumentToPdf = async (
  document: TipTapDocument,
  filename: string,
) => {
  const imageSources = [...new Set(collectTipTapImageSources(document))];

  const resolvedImageSources = new Map(
    await Promise.all(
      imageSources.map(
        async (source): Promise<[string, string]> => [
          source,
          URL.createObjectURL(await fetchPdfImageAsset(source)),
        ],
      ),
    ),
  );

  try {
    const blob = await pdf(
      <TipTapPdfDocument
        document={document}
        resolvedImageSources={resolvedImageSources}
      />,
    ).toBlob();

    saveAs(blob, `${filename}.pdf`);
  } finally {
    resolvedImageSources.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
  }
};
