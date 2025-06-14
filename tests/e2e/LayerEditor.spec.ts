import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('StyleEditor', () => {

  test('ヘッダーにタイトルとstyleダウンロードボタンが表示される', async ({ page }) => {
    await page.goto('/');

    // ① ヘッダーにタイトルとstyleダウンロードボタンが表示される
    await expect(page.getByRole('heading', { name: /map style studio/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /styleダウンロード/i })).toBeVisible();


    // FileImporterでダミーstyle.jsonをアップロード
    const filePath = path.resolve(__dirname, 'dummy-style.json');
    await page.setInputFiles('input[type="file"]', filePath);

    // ダウンロードボタンが有効になるまで待つ
    await expect(page.getByRole('button', { name: /styleダウンロード/i })).toBeEnabled();

    // ② styleダウンロードボタンをクリックするとファイルがダウンロードされる
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /styleダウンロード/i }).click(),
    ]);
    // ファイル名の確認
    expect(await download.suggestedFilename()).toBe('style.json');
    const downloadFilePath = await download.path();
    const content = await fs.promises.readFile(downloadFilePath, 'utf8');
    expect(content).toContain('"version"');
    expect(content).toContain('"sources"');
    expect(content).toContain('"layers"');

    // ④サイドバーでLayerListが表示される
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page.getByPlaceholder('レイヤー検索')).toBeVisible();
  });

});
