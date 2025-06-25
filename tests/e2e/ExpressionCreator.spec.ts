import { test, expect } from '@playwright/test';

test.describe('ExpressionCreator', () => {
  test('属性情報ポップアップ上のボタンをクリックすると、expression生成ツールが表示される', async ({ page }) => {
    await page.goto('/');

    // サンプルスタイルを開く ボタンをクリック
    await page.getByRole('button', { name: 'サンプルスタイルを開く' }).click();

    // 地図が表示されるのを待つ
    await page.waitForFunction(() => window.map && window.map.loaded(), { timeout: 80000 });

    // 表示位置を指定して地図を開く
    await page.evaluate(() => {
      window.map.flyTo({
        center: [127.800123, 26.291241],
        zoom: 16.84
      });
    });

    // flyTo後に地図の移動完了を待つ
    await page.waitForFunction(() =>
      window.map && window.map.getCenter().lng.toFixed(5) === '127.80012' &&
      window.map.getCenter().lat.toFixed(5) === '26.29124' &&
      Math.abs(window.map.getZoom() - 16.84) < 0.1
    );

    // 地図の任意箇所をクリックする
    const { x, y } = await page.evaluate(
        ([lng, lat]) => {
            const { x, y } = window.map.project([lng, lat]);
            return { x, y };
        },
        [127.79992, 26.29137]
    );
    await page.mouse.click(x, y);

    // // 属性情報ポップアップが表示されるのを待つ
    // await page.waitForSelector('#mapPopup', { timeout: 80000 });

    // 属性情報ポップアップ内の「showExpressionCreatorBtn」クラスのついたボタンをクリック
    await page.locator('.showExpressionCreatorBtn').waitFor({ timeout: 80000 });
    await page.locator('.showExpressionCreatorBtn').click();

    // ExpressionCreatorが表示されるのを待つ
    await page.waitForSelector('.expressionCreator');

    // プルダウン、inputが表示されていることを確認
    await expect(page.locator('#expressionType')).toBeVisible();
    await expect(page.locator('#expressionStr')).toBeVisible();
  });
});
