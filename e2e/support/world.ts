import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from 'playwright';

const BASE_URL = 'http://localhost:5173/map-style-studio/';

// Geolonia Maps のベーススタイル URL (CI では空スタイルに差し替え)
const GEOLONIA_STYLE_PATTERN = '**/smartmap.styles.geoloniamaps.com/**';
const EMPTY_STYLE = JSON.stringify({
  version: 8,
  sources: {},
  layers: [],
});

export class PlaywrightWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  readonly baseUrl = BASE_URL;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init() {
    this.browser = await chromium.launch({
      headless: !process.env.HEADED,
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    this.page = await this.context.newPage();

    // CI / ヘッドレス環境: Geolonia Maps スタイル URL を空スタイルに差し替え (SwiftShader 対応)
    await this.page.route(GEOLONIA_STYLE_PATTERN, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: EMPTY_STYLE,
      });
    });
  }

  async cleanup() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  /**
   * MapLibre のクリックヘルパー (SwiftShader 対応)
   * mouse.move → mousedown → mouseup パターンで確実にクリックを発火させる
   */
  async clickMapAtOffset(offsetX: number, offsetY: number) {
    const mapEl = this.page.locator('[data-testid="map"]');
    const box = await mapEl.boundingBox();
    if (!box) throw new Error('map element not found');
    const x = box.x + offsetX;
    const y = box.y + offsetY;
    await this.page.mouse.move(x, y);
    await this.page.mouse.down();
    await this.page.mouse.up();
  }
}

setWorldConstructor(PlaywrightWorld);
