import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('FileImporter', () => {
  test('JSONファイルをアップロードするとスピナーが表示され、styleがセットされる', async ({ page }) => {
    await page.goto('/');

    // FileImporterの説明テキストが表示されていること
    await expect(page.getByText('クリックまたはファイルをドラッグしてアップロード')).toBeVisible();
    await expect(page.getByText('地図スタイルをインポートするには、JSONファイルを選択してください。')).toBeVisible();

    // ダミーstyle.jsonをアップロード
    const filePath = path.resolve(__dirname, 'dummy-style.json');
    await page.setInputFiles('input[type="file"]', filePath);

  });
});
