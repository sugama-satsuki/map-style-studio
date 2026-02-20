import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { setWorldConstructor, World as CucumberWorld } from '@cucumber/cucumber';

export class MapStyleWorld extends CucumberWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  baseURL = 'http://localhost:5173';

  async init() {
    this.browser = await chromium.launch({ headless: !process.env.HEADED });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async cleanup() {
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(MapStyleWorld);
