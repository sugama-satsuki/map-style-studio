import {
  guessLayerType,
  getThemeColor,
  generateStyleFromTheme,
  ThemeColorsType,
} from '../../src/utils/generateStyleFromTheme';
import type { StyleSpecification, LayerSpecification } from 'maplibre-gl';

describe('guessLayerType', () => {
  it('id に "building" を含む → "building"', () => {
    const layer: LayerSpecification = { id: 'building-fill', type: 'fill' };
    expect(guessLayerType(layer)).toBe('building');
  });

  it('id に "建物" を含む → "building"', () => {
    const layer: LayerSpecification = { id: '建物-layer', type: 'fill' };
    expect(guessLayerType(layer)).toBe('building');
  });

  it('id に "road" を含む → "road"', () => {
    const layer: LayerSpecification = { id: 'road-line', type: 'line' };
    expect(guessLayerType(layer)).toBe('road');
  });

  it('id に "highway" を含む → "road"', () => {
    const layer: LayerSpecification = { id: 'highway-main', type: 'line' };
    expect(guessLayerType(layer)).toBe('road');
  });

  it('id に "道路" を含む → "road"', () => {
    const layer: LayerSpecification = { id: '道路-line', type: 'line' };
    expect(guessLayerType(layer)).toBe('road');
  });

  it('id に "background" を含む → "background"', () => {
    const layer: LayerSpecification = { id: 'background', type: 'background' };
    expect(guessLayerType(layer)).toBe('background');
  });

  it('id に "bg" を含む → "background"', () => {
    const layer: LayerSpecification = { id: 'bg-layer', type: 'background' };
    expect(guessLayerType(layer)).toBe('background');
  });

  it('id に "背景" を含む → "background"', () => {
    const layer: LayerSpecification = { id: '背景-fill', type: 'fill' };
    expect(guessLayerType(layer)).toBe('background');
  });

  it('それ以外は "other"', () => {
    const layer: LayerSpecification = { id: 'park-fill', type: 'fill' };
    expect(guessLayerType(layer)).toBe('other');
  });
});

describe('getThemeColor', () => {
  const theme: ThemeColorsType = {
    primary: '#111111',
    secondary: '#222222',
    tertiary: '#333333',
  };

  it('building → primary', () => {
    expect(getThemeColor('building', theme)).toBe('#111111');
  });

  it('road → secondary', () => {
    expect(getThemeColor('road', theme)).toBe('#222222');
  });

  it('road → primary (secondary がない場合)', () => {
    const themeNoSecondary: ThemeColorsType = { primary: '#aabbcc' };
    expect(getThemeColor('road', themeNoSecondary)).toBe('#aabbcc');
  });

  it('background → tertiary', () => {
    expect(getThemeColor('background', theme)).toBe('#333333');
  });

  it('background → secondary (tertiary がない場合)', () => {
    const themeNoTertiary: ThemeColorsType = { primary: '#aa', secondary: '#bb' };
    expect(getThemeColor('background', themeNoTertiary)).toBe('#bb');
  });

  it('background → primary (secondary も tertiary もない場合)', () => {
    const themeMinimal: ThemeColorsType = { primary: '#aabbcc' };
    expect(getThemeColor('background', themeMinimal)).toBe('#aabbcc');
  });

  it('other → primary', () => {
    expect(getThemeColor('other', theme)).toBe('#111111');
  });
});

describe('generateStyleFromTheme', () => {
  const baseStyle: StyleSpecification = {
    version: 8,
    sources: {},
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: { 'background-color': '#ffffff' },
      },
      {
        id: 'building-fill',
        type: 'fill',
        paint: { 'fill-color': '#aaaaaa' },
      },
      {
        id: 'road-line',
        type: 'line',
        paint: { 'line-color': '#888888' },
      },
      {
        id: 'park-fill',
        type: 'fill',
        paint: { 'fill-color': '#00ff00' },
      },
      {
        id: 'symbol-layer',
        type: 'symbol',
        // paint なし → layout も undefined のテスト
      },
    ],
  } as StyleSpecification;

  it('background レイヤーの色が調整された明るい色に変わる', async () => {
    const theme: ThemeColorsType = { primary: '#ff0000' };
    const result = await generateStyleFromTheme(theme, baseStyle);

    const bgLayer = result.layers.find(l => l.id === 'background');
    expect(bgLayer).toBeDefined();
    expect(bgLayer?.paint?.['background-color']).toBeDefined();
    // 元の白ではなく、テーマ色から算出した背景色に変わっている
    expect(bgLayer?.paint?.['background-color']).not.toBe('#ffffff');
  });

  it('building-fill の fill-color がテーマカラーに置換される', async () => {
    const theme: ThemeColorsType = { primary: '#0000ff' };
    const result = await generateStyleFromTheme(theme, baseStyle);

    const buildingLayer = result.layers.find(l => l.id === 'building-fill');
    expect(buildingLayer?.paint?.['fill-color']).toBe('#0000ff');
  });

  it('road-line の line-color が secondary カラーに置換される', async () => {
    const theme: ThemeColorsType = { primary: '#0000ff', secondary: '#00ff00' };
    const result = await generateStyleFromTheme(theme, baseStyle);

    const roadLayer = result.layers.find(l => l.id === 'road-line');
    expect(roadLayer?.paint?.['line-color']).toBe('#00ff00');
  });

  it('paint のないレイヤーも処理される (layout が補完される)', async () => {
    const theme: ThemeColorsType = { primary: '#ff0000' };
    const result = await generateStyleFromTheme(theme, baseStyle);

    const symbolLayer = result.layers.find(l => l.id === 'symbol-layer');
    expect(symbolLayer).toBeDefined();
    expect(symbolLayer?.layout).toEqual({});
  });

  it('元のスタイルを変更しない (イミュータブル)', async () => {
    const theme: ThemeColorsType = { primary: '#ff0000' };
    const originalColor = (baseStyle.layers[1].paint as Record<string, unknown>)['fill-color'];
    await generateStyleFromTheme(theme, baseStyle);
    expect((baseStyle.layers[1].paint as Record<string, unknown>)['fill-color']).toBe(originalColor);
  });
});
