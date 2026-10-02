import { validateRichTextFieldOrThrow } from 'src/engine/api/common/common-args-processors/data-arg-processor/validator-utils/validate-rich-text-field-or-throw.util';
import { CommonQueryRunnerException } from 'src/engine/api/common/common-query-runners/errors/common-query-runner.exception';

describe('validateRichTextFieldOrThrow', () => {
  describe('valid inputs', () => {
    it('should return null when value is null', () => {
      const result = validateRichTextFieldOrThrow(null, 'testField');

      expect(result).toBeNull();
    });

    it('should return value when value is an empty object', () => {
      const result = validateRichTextFieldOrThrow({}, 'testField');

      expect(result).toEqual({});
    });

    it('should return the value when it has valid subfields', () => {
      const value = {
        blocknote:
          '[{"type":"paragraph","content":[{"type":"text","text":"test"}]}]',
        markdown: '# Heading\nContent',
      };
      const result = validateRichTextFieldOrThrow(value, 'testField');

      expect(result).toEqual(value);
    });

    it('should return the value when blocknote is null', () => {
      const value = { blocknote: null, markdown: 'test' };
      const result = validateRichTextFieldOrThrow(value, 'testField');

      expect(result).toEqual(value);
    });

    it('should return the value when only markdown is provided', () => {
      const value = { markdown: '# Heading' };
      const result = validateRichTextFieldOrThrow(value, 'testField');

      expect(result).toEqual(value);
    });
  });

  describe('invalid inputs', () => {
    it('should throw when value is undefined', () => {
      expect(() =>
        validateRichTextFieldOrThrow(undefined, 'testField'),
      ).toThrow(CommonQueryRunnerException);
    });

    it('should throw when value is a string', () => {
      expect(() =>
        validateRichTextFieldOrThrow('not an object', 'testField'),
      ).toThrow(CommonQueryRunnerException);
    });

    it('should throw when value has invalid subfields', () => {
      const value = { invalidField: 'value' };

      expect(() => validateRichTextFieldOrThrow(value, 'testField')).toThrow(
        CommonQueryRunnerException,
      );
      expect(() => validateRichTextFieldOrThrow(value, 'testField')).toThrow(
        /Invalid subfield.*invalidField.*rich text field/,
      );
    });

    it('should throw when blocknote contains invalid JSON', () => {
      const value = { blocknote: 'not-valid-json' };

      expect(() => validateRichTextFieldOrThrow(value, 'testField')).toThrow(
        CommonQueryRunnerException,
      );
      expect(() => validateRichTextFieldOrThrow(value, 'testField')).toThrow(
        /must contain valid JSON/,
      );
    });

    it('should throw when blocknote is valid JSON but not an array', () => {
      const value = { blocknote: '{"type":"paragraph"}' };

      expect(() => validateRichTextFieldOrThrow(value, 'testField')).toThrow(
        CommonQueryRunnerException,
      );
      expect(() => validateRichTextFieldOrThrow(value, 'testField')).toThrow(
        /has an invalid structure/,
      );
    });
  });

  describe('tiptap subfield', () => {
    const buildTipTapValue = (document: unknown) => ({
      tiptap: JSON.stringify(document),
    });

    const paragraph = (text: string) => ({
      type: 'paragraph',
      content: [{ type: 'text', text }],
    });

    it('should accept a record rich text document', () => {
      const value = buildTipTapValue({
        type: 'doc',
        content: [
          paragraph('hello'),
          {
            type: 'image',
            attrs: { src: 'https://example.com/a.png', alt: '' },
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'link',
                marks: [
                  { type: 'link', attrs: { href: 'https://twenty.com' } },
                  { type: 'textStyle', attrs: { color: 'red' } },
                ],
              },
            ],
          },
        ],
      });

      expect(validateRichTextFieldOrThrow(value, 'testField')).toEqual(value);
    });

    it('should reject a document that is not a doc node', () => {
      expect(() =>
        validateRichTextFieldOrThrow(
          buildTipTapValue([paragraph('x')]),
          'testField',
        ),
      ).toThrow(/has an invalid structure/);
    });

    it('should reject raw HTML and email-only nodes', () => {
      for (const node of [
        { type: 'html', attrs: { html: '<img src=x onerror=alert(1)>' } },
        { type: 'section', content: [paragraph('x')] },
        { type: 'button', attrs: { href: 'https://twenty.com' } },
      ]) {
        expect(() =>
          validateRichTextFieldOrThrow(
            buildTipTapValue({ type: 'doc', content: [node] }),
            'testField',
          ),
        ).toThrow(/node type that is not allowed/);
      }
    });

    it('should reject unknown marks', () => {
      expect(() =>
        validateRichTextFieldOrThrow(
          buildTipTapValue({
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'x', marks: [{ type: 'script' }] },
                ],
              },
            ],
          }),
          'testField',
        ),
      ).toThrow(/mark type that is not allowed/);
    });

    it('should reject dangerous URLs in image sources, file URLs and links', () => {
      for (const node of [
        { type: 'image', attrs: { src: 'javascript:alert(1)' } },
        { type: 'file', attrs: { url: 'data:text/html,<script>' } },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'x',
              marks: [
                { type: 'link', attrs: { href: ' javascript:alert(1)' } },
              ],
            },
          ],
        },
      ]) {
        expect(() =>
          validateRichTextFieldOrThrow(
            buildTipTapValue({ type: 'doc', content: [node] }),
            'testField',
          ),
        ).toThrow(/dangerous protocol/);
      }
    });

    it('should reject documents nested too deeply', () => {
      let node: Record<string, unknown> = paragraph('leaf');

      for (let level = 0; level < 100; level++) {
        node = { type: 'blockquote', content: [node] };
      }

      expect(() =>
        validateRichTextFieldOrThrow(
          buildTipTapValue({ type: 'doc', content: [node] }),
          'testField',
        ),
      ).toThrow(/nested too deeply/);
    });
  });

  describe('blocknote subfield safety', () => {
    it('should reject dangerous URLs at any depth and under any URL key', () => {
      const blocks = [
        {
          type: 'bulletListItem',
          content: [],
          children: [
            {
              type: 'image',
              props: { src: 'javascript:alert(1)' },
              children: [],
            },
          ],
        },
      ];

      expect(() =>
        validateRichTextFieldOrThrow(
          { blocknote: JSON.stringify(blocks) },
          'testField',
        ),
      ).toThrow(/dangerous protocol/);
    });
  });
});
