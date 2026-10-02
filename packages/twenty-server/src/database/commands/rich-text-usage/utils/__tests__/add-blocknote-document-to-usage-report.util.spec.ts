import { addBlockNoteDocumentToUsageReport } from 'src/database/commands/rich-text-usage/utils/add-blocknote-document-to-usage-report.util';
import { createEmptyRichTextUsageReport } from 'src/database/commands/rich-text-usage/utils/create-empty-rich-text-usage-report.util';

describe('addBlockNoteDocumentToUsageReport', () => {
  it('should count blocks, inline content, styles and nesting', () => {
    const report = createEmptyRichTextUsageReport();

    addBlockNoteDocumentToUsageReport(
      JSON.stringify([
        {
          type: 'heading',
          props: { level: 4, isToggleable: true, textColor: 'red' },
          content: [
            { type: 'text', text: 'a', styles: { bold: true } },
            {
              type: 'link',
              href: 'https://twenty.com',
              content: [{ type: 'text', text: 'b', styles: { code: true } }],
            },
          ],
          children: [
            {
              type: 'toggleListItem',
              props: { textAlignment: 'left' },
              content: [{ type: 'mention', props: {} }],
              children: [],
            },
          ],
        },
      ]),
      report,
    );

    expect(report).toEqual({
      documentCount: 1,
      unparseableCount: 0,
      maxNestingLevel: 1,
      blockTypes: { heading: 1, toggleListItem: 1 },
      inlineTypes: { text: 2, link: 1, mention: 1 },
      styles: {
        bold: 1,
        code: 1,
        'block.textColor': 1,
        'block.isToggleable': 1,
      },
    });
  });

  it('should count unparseable values and ignore empty ones', () => {
    const report = createEmptyRichTextUsageReport();

    addBlockNoteDocumentToUsageReport('not json', report);
    addBlockNoteDocumentToUsageReport('{}', report);
    addBlockNoteDocumentToUsageReport(null, report);

    expect(report.unparseableCount).toBe(2);
    expect(report.documentCount).toBe(0);
  });
});
