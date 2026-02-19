import { isLayerMatched } from '../../src/utils/searchHelpers';
import type { LayerSpecification } from 'maplibre-gl';

// FillLayerSpecification は source が必須のため unknown 経由でキャスト
function layer(obj: Record<string, unknown>): LayerSpecification {
  return obj as unknown as LayerSpecification;
}

// テスト用レイヤー
const fillLayer = layer({ id: 'building-fill', type: 'fill', paint: { 'fill-color': '#cc0000' } }); // 赤
const lineLayer = layer({ id: 'road-line', type: 'line', paint: { 'line-color': '#00cc00' }, filter: ['==', 'class', 'motorway'] }); // 緑
const symbolLayer = layer({ id: 'poi-label', type: 'symbol', layout: { 'text-field': '{name}' } });
const greenLayer = layer({ id: 'park-fill', type: 'fill', paint: { 'fill-color': '#33aa33' } }); // 緑
const blueLayer = layer({ id: 'water-fill', type: 'fill', paint: { 'fill-color': '#3366ff' } }); // 青
const yellowLayer = layer({ id: 'highway-fill', type: 'fill', paint: { 'fill-color': '#ffcc00' } }); // 黄
const brownLayer = layer({ id: 'soil-fill', type: 'fill', paint: { 'fill-color': '#8B4513' } }); // 茶
const blackLayer = layer({ id: 'dark-layer', type: 'fill', paint: { 'fill-color': '#000000' } }); // 黒
const whiteLayer = layer({ id: 'light-layer', type: 'fill', paint: { 'fill-color': '#ffffff' } }); // 白

describe('isLayerMatched', () => {
  describe('テキスト検索', () => {
    it('レイヤー id でマッチする', () => {
      expect(isLayerMatched(fillLayer, 'building')).toBe(true);
      expect(isLayerMatched(fillLayer, 'BUILDING')).toBe(true); // 大文字小文字無視
    });

    it('レイヤー id がマッチしない場合 false', () => {
      expect(isLayerMatched(fillLayer, 'water')).toBe(false);
    });

    it('paint の内容でマッチする', () => {
      expect(isLayerMatched(lineLayer, 'line-color')).toBe(true);
      expect(isLayerMatched(lineLayer, '00cc00')).toBe(true);
    });

    it('filter の内容でマッチする', () => {
      expect(isLayerMatched(lineLayer, 'motorway')).toBe(true);
    });

    it('layout の内容でマッチする', () => {
      expect(isLayerMatched(symbolLayer, 'text-field')).toBe(true);
      expect(isLayerMatched(symbolLayer, '{name}')).toBe(true);
    });

    it('paint も filter も layout もないレイヤーで空文字マッチ', () => {
      const bare: LayerSpecification = { id: 'bare', type: 'background' };
      expect(isLayerMatched(bare, 'bare')).toBe(true);
      expect(isLayerMatched(bare, 'notfound')).toBe(false);
    });
  });

  describe('色キーワード検索', () => {
    it('「緑」でマッチ', () => {
      expect(isLayerMatched(greenLayer, '緑')).toBe(true);
      expect(isLayerMatched(fillLayer, '緑')).toBe(false); // 赤レイヤーは不一致
    });

    it('「みどり」でマッチ', () => {
      expect(isLayerMatched(greenLayer, 'みどり')).toBe(true);
    });

    it('「green」でマッチ', () => {
      expect(isLayerMatched(greenLayer, 'green')).toBe(true);
    });

    it('「赤」でマッチ', () => {
      expect(isLayerMatched(fillLayer, '赤')).toBe(true); // #cc0000 は赤
      expect(isLayerMatched(greenLayer, '赤')).toBe(false);
    });

    it('「あか」でマッチ', () => {
      expect(isLayerMatched(fillLayer, 'あか')).toBe(true);
    });

    it('「red」でマッチ', () => {
      expect(isLayerMatched(fillLayer, 'red')).toBe(true);
    });

    it('「黄」でマッチ', () => {
      expect(isLayerMatched(yellowLayer, '黄')).toBe(true);
      expect(isLayerMatched(fillLayer, '黄')).toBe(false);
    });

    it('「黄色」でマッチ', () => {
      expect(isLayerMatched(yellowLayer, '黄色')).toBe(true);
    });

    it('「きいろ」でマッチ', () => {
      expect(isLayerMatched(yellowLayer, 'きいろ')).toBe(true);
    });

    it('「yellow」でマッチ', () => {
      expect(isLayerMatched(yellowLayer, 'yellow')).toBe(true);
    });

    it('「青」でマッチ', () => {
      expect(isLayerMatched(blueLayer, '青')).toBe(true);
      expect(isLayerMatched(greenLayer, '青')).toBe(false);
    });

    it('「あお」でマッチ', () => {
      expect(isLayerMatched(blueLayer, 'あお')).toBe(true);
    });

    it('「blue」でマッチ', () => {
      expect(isLayerMatched(blueLayer, 'blue')).toBe(true);
    });

    it('「茶」でマッチ', () => {
      expect(isLayerMatched(brownLayer, '茶')).toBe(true);
      expect(isLayerMatched(greenLayer, '茶')).toBe(false);
    });

    it('「茶色」でマッチ', () => {
      expect(isLayerMatched(brownLayer, '茶色')).toBe(true);
    });

    it('「ちゃ」でマッチ', () => {
      expect(isLayerMatched(brownLayer, 'ちゃ')).toBe(true);
    });

    it('「brown」でマッチ', () => {
      expect(isLayerMatched(brownLayer, 'brown')).toBe(true);
    });

    it('「黒」でマッチ', () => {
      expect(isLayerMatched(blackLayer, '黒')).toBe(true);
      expect(isLayerMatched(whiteLayer, '黒')).toBe(false);
    });

    it('「くろ」でマッチ', () => {
      expect(isLayerMatched(blackLayer, 'くろ')).toBe(true);
    });

    it('「black」でマッチ', () => {
      expect(isLayerMatched(blackLayer, 'black')).toBe(true);
    });

    it('「白」でマッチ', () => {
      expect(isLayerMatched(whiteLayer, '白')).toBe(true);
      expect(isLayerMatched(blackLayer, '白')).toBe(false);
    });

    it('「しろ」でマッチ', () => {
      expect(isLayerMatched(whiteLayer, 'しろ')).toBe(true);
    });

    it('「white」でマッチ', () => {
      expect(isLayerMatched(whiteLayer, 'white')).toBe(true);
    });

    it('paint のないレイヤーは色キーワードで false', () => {
      expect(isLayerMatched(symbolLayer, '緑')).toBe(false);
    });
  });
});
