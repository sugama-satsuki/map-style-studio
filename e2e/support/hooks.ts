import { Before, After, Status } from '@cucumber/cucumber';
import { MapStyleWorld } from './world';

Before(async function (this: MapStyleWorld) {
  await this.init();
});

After(async function (this: MapStyleWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await this.page?.screenshot();
    if (screenshot) {
      await this.attach(screenshot, 'image/png');
    }
  }
  await this.cleanup();
});
