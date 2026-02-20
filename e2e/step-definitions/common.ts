import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'playwright/test';
import { MapStyleWorld } from '../support/world';

Given('アプリが起動している', async function (this: MapStyleWorld) {
  await this.page.goto(this.baseURL);
  await this.page.waitForLoadState('networkidle');
});

Given('サンプルスタイルが読み込まれている', async function (this: MapStyleWorld) {
  await this.page.goto(this.baseURL);
  await this.page.waitForLoadState('networkidle');
  await this.page.getByTestId('open-sample-style-button').click();
  await this.page.waitForTimeout(1000);
});

When('「サンプルスタイルを開く」ボタンをクリックする', async function (this: MapStyleWorld) {
  await this.page.getByTestId('open-sample-style-button').click();
  await this.page.waitForTimeout(1000);
});

When('サイドバーで「スプライト」メニューをクリックする', async function (this: MapStyleWorld) {
  await this.page.getByText('スプライト').click();
  await this.page.waitForTimeout(500);
});

Then('ウェルカムタイトルが表示される', async function (this: MapStyleWorld) {
  await expect(this.page.getByText('地図スタイルを読み込む')).toBeVisible();
});

Then('「サンプルスタイルを開く」ボタンが表示される', async function (this: MapStyleWorld) {
  await expect(this.page.getByTestId('open-sample-style-button')).toBeVisible();
});

Then('「Geolonia 標準スタイルを開く」ボタンが表示される', async function (this: MapStyleWorld) {
  await expect(this.page.getByTestId('open-geolonia-style-button')).toBeVisible();
});

Then('サイドバーが表示される', async function (this: MapStyleWorld) {
  await expect(this.page.getByTestId('sidebar')).toBeVisible();
});

Then('「スタイルを保存する」ボタンが表示される', async function (this: MapStyleWorld) {
  await expect(this.page.getByTestId('download-button')).toBeVisible();
});

Then('「準備中」タグが表示される', async function (this: MapStyleWorld) {
  await expect(this.page.getByText('準備中').first()).toBeVisible();
});

Then('スプライト準備中メッセージが表示される', async function (this: MapStyleWorld) {
  await expect(this.page.getByText('スプライト機能は準備中です')).toBeVisible();
});
