import { expect, test } from '../lib/fixtures/screenshot';
import { postBackendGraphQL } from '../lib/requests/post-backend-graphql';
import { setCurrentWorkspaceFeatureFlag } from '../lib/requests/set-current-workspace-feature-flag';

const TIPTAP_FLAG = 'IS_TIPTAP_RICH_TEXT_EDITOR_ENABLED';

type NoteBody = {
  note: {
    bodyV2: {
      blocknote: string | null;
      markdown: string | null;
      tiptap: string | null;
    };
  };
};

for (const isTiptapEnabled of [false, true]) {
  test.describe(`Note body with the ${isTiptapEnabled ? 'Tiptap' : 'BlockNote'} editor`, () => {
    let noteId: string | undefined;

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await setCurrentWorkspaceFeatureFlag({
        page,
        featureFlag: TIPTAP_FLAG,
        value: isTiptapEnabled,
      });

      const { body } = await postBackendGraphQL<{ createNote: { id: string } }>(
        {
          page,
          data: {
            query: `mutation { createNote(data: { title: "Rich text e2e" }) { id } }`,
          },
        },
      );

      noteId = body.data?.createNote.id;
    });

    test.afterEach(async ({ page }) => {
      if (noteId !== undefined) {
        await postBackendGraphQL({
          page,
          data: {
            query: `mutation DestroyNote($id: UUID!) { destroyNote(id: $id) { id } }`,
            variables: { id: noteId },
          },
        });
      }

      await setCurrentWorkspaceFeatureFlag({
        page,
        featureFlag: TIPTAP_FLAG,
        value: false,
      });
    });

    test('saves typed text in every rich text format', async ({ page }) => {
      const text = `Typed with ${isTiptapEnabled ? 'Tiptap' : 'BlockNote'}`;

      await page.goto(`/object/note/${noteId}`);

      const editor = page.locator('[contenteditable="true"]').last();

      await editor.click();
      await page.keyboard.type(text);
      await page.keyboard.press('Escape');

      await expect
        .poll(
          async () => {
            const { body } = await postBackendGraphQL<NoteBody>({
              page,
              data: {
                query: `query FindNote($id: UUID!) { note(filter: { id: { eq: $id } }) { bodyV2 { blocknote markdown tiptap } } }`,
                variables: { id: noteId },
              },
            });

            return body.data?.note.bodyV2;
          },
          { timeout: 10_000 },
        )
        .toEqual({
          blocknote: expect.stringContaining(text),
          markdown: expect.stringContaining(text),
          tiptap: expect.stringContaining(text),
        });

      await page.reload();

      await expect(page.getByText(text)).toBeVisible();
    });
  });
}
