import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightWorld } from '../support/world';

Given('アプリが起動している', async function (this: PlaywrightWorld) {
  await this.page.goto(this.baseUrl);
  // スタイル選択画面が表示されるまで待つ
  await this.page.waitForSelector('button', { timeout: 10000 });
});

Given('サンプルスタイルが読み込まれている', async function (this: PlaywrightWorld) {
  await this.page.goto(this.baseUrl);
  await this.page.waitForSelector('button', { timeout: 10000 });
  // サンプルスタイルを開く
  await this.page.click('button:has-text("サンプルスタイルを開く")');
  // サイドバーが表示されるまで待つ
  await this.page.waitForSelector('[data-testid="sidebar"]', { timeout: 10000 });
});

When('「サンプルスタイルを開く」ボタンをクリックする', async function (this: PlaywrightWorld) {
  await this.page.click('button:has-text("サンプルスタイルを開く")');
});

When('「別のスタイルを読み込む」ボタンをクリックする', async function (this: PlaywrightWorld) {
  await this.page.click('button:has-text("別のスタイルを読み込む")');
});

Then('サイドバーが表示される', async function (this: PlaywrightWorld) {
  const sidebar = this.page.locator('[data-testid="sidebar"]');
  await expect(sidebar).toBeVisible({ timeout: 10000 });
});

Then('スタイル選択画面が表示される', async function (this: PlaywrightWorld) {
  const sampleBtn = this.page.locator('button:has-text("サンプルスタイルを開く")');
  await expect(sampleBtn).toBeVisible({ timeout: 10000 });
});

Then('「サンプルスタイルを開く」ボタンが表示される', async function (this: PlaywrightWorld) {
  const btn = this.page.locator('button:has-text("サンプルスタイルを開く")');
  await expect(btn).toBeVisible({ timeout: 10000 });
});

Then('「styleダウンロード」ボタンが表示される', async function (this: PlaywrightWorld) {
  const btn = this.page.locator('button:has-text("styleダウンロード")');
  await expect(btn).toBeVisible({ timeout: 10000 });
});
