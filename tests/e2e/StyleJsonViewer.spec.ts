
import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('StyleJsonViewer', () => {
  test('style.jsonの内容が表示され、編集・保存できる', async ({ page }) => {
    await page.goto('/');

    // まずダミーstyle.jsonをアップロードしてstyleAtomをセット
    const filePath = path.resolve(__dirname, 'dummy-style.json');
    await page.setInputFiles('input[type="file"]', filePath);

    // サイドバーで「style-viewer」メニューに切り替え（ボタンやタブのテキストで切り替え）
    // 例: ボタンに「style」や「style-viewer」などのテキストがある場合
await page.getByText(/jsonビューア|style-viewer|style\.?json/i).click();

    // style.json ビューアが表示されていること
    await expect(page.getByText('style.json ビューア')).toBeVisible();

    // JSONコードが表示されていること
    await expect(page.getByText(/"version": 8/)).toBeVisible();

    // 編集ボタンを押す
    const viewer = page.locator('#style-json-viewer');
    await viewer.getByText(/編\s*集/).click();

    // textareaが表示されていること
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();

    // JSONを編集して保存
    const newJson = `{
  "version": 8,
  "sources": {},
  "layers": [{"id":"test","type":"fill"}]
}`;
    await textarea.fill(newJson);
    await page.getByRole('button', { name: /保\s*存/ }).click();

    // 保存後、style.jsonの内容が更新されていること
    await expect(page.getByText(/"id": "test"/)).toBeVisible();
    await expect(page.getByText(/"type": "fill"/)).toBeVisible();
  });
});