import { Before, After, ITestCaseHookParameter } from '@cucumber/cucumber';
import { PlaywrightWorld } from './world';

Before(async function (this: PlaywrightWorld) {
  await this.init();
});

After(async function (this: PlaywrightWorld, scenario: ITestCaseHookParameter) {
  // 失敗時はスクリーンショットを保存
  if (scenario.result?.status === 'FAILED' && this.page) {
    const name = scenario.pickle.name.replace(/[^a-zA-Z0-9ぁ-んァ-ヶー一-龠]/g, '_');
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
    console.error(`[E2E] FAILED: ${scenario.pickle.name}`);
    console.error(`[E2E] Screenshot saved as attachment`);
    void name;
  }
  await this.cleanup();
});
