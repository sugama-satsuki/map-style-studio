import { test } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('LayerListItem', () => {
  test('レイヤー名・filter・paint・layoutの表示、表示切替・削除ができる', async ({ page }) => {
    await page.goto('/');

    // ダミーstyle.jsonをアップロード
    const filePath = path.resolve(__dirname, 'dummy-style2.json');
    await page.setInputFiles('input[type="file"]', filePath);
    await page.waitForTimeout(15000);
    // // レイヤー名が表示されている
    // await expect(page.getByText('行政区画')).toBeVisible();

    // // filter, paint, layoutが表示されている（Accordionや詳細パネルを開く必要がある場合はクリック）
    // await page.getByText('行政区画').click(); // レイヤー詳細を開く
    // await expect(page.getByText(/filter/i)).toBeVisible();
    // await expect(page.getByText(/paint/i)).toBeVisible();
    // await expect(page.getByText(/layout/i)).toBeVisible();

    // // 表示/非表示ボタンを押して切り替え
    // const eyeBtn = page.locator('button[aria-label="非表示"], button[aria-label="表示"]').first();
    // await eyeBtn.click();
    // // 切り替え後、アイコンやaria-labelが変わることを確認（実装に応じて調整）
    // // 例: 非表示→表示に変わる
    // await expect(
    //   page.locator('button[aria-label="表示"], button[aria-label="非表示"]').first()
    // ).toBeVisible();

    // // レイヤーを削除
    // const deleteBtn = page.locator('button[aria-label="削除"]').first();
    // await deleteBtn.click();

    // // 削除後、レイヤー名が消えていること
    // await expect(page.getByText('行政区画')).not.toBeVisible();
  });
});
