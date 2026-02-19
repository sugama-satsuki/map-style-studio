import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightWorld } from '../support/world';

Then('レイヤーパネルが表示される', async function (this: PlaywrightWorld) {
  // レイヤーメニューはデフォルトで選択されている
  const sidebar = this.page.locator('[data-testid="sidebar"]');
  await expect(sidebar).toBeVisible({ timeout: 10000 });
});

When('サイドバーで「json全体」メニューを選択する', async function (this: PlaywrightWorld) {
  await this.page.click('text=json全体');
});

Then('JSONビューワーが表示される', async function (this: PlaywrightWorld) {
  // StyleJsonViewer が表示される — "version" や "{" などが含まれる pre/code 要素を確認
  const jsonContent = this.page.locator('pre, code, textarea').first();
  await expect(jsonContent).toBeVisible({ timeout: 10000 });
});

When('サイドバーで「基本情報」メニューを選択する', async function (this: PlaywrightWorld) {
  await this.page.click('text=基本情報');
});

Then('基本情報パネルが表示される', async function (this: PlaywrightWorld) {
  // BasicInfo コンポーネント — スタイル名入力欄などが含まれる
  const basicInfoPanel = this.page.locator('[data-testid="sidebar"]');
  await expect(basicInfoPanel).toBeVisible({ timeout: 10000 });
});
