import {
  guessLayerType,
  getThemeColor,
  generateStyleFromTheme,
  getLuminance,
  getBrightestColor,
  replaceColorValue,
  ThemeColorsType,
} from '../../src/utils/generateStyleFromTheme';
import type { StyleSpecification, LayerSpecification } from 'maplibre-gl';

// source が必須の型を回避するヘルパー
function layer(obj: Record<string, unknown>): LayerSpecification {
  return obj as unknown as LayerSpecification;
}

describe('guessLayerType', () => {
  it('id に "building" を含む → "building"', () => {
    expect(guessLayerType(layer({ id: 'building-fill', type: 'fill' }))).toBe('building');
  });

  it('id に "建物" を含む → "building"', () => {
    expect(guessLayerType(layer({ id: '建物-layer', type: 'fill' }))).toBe('building');
  });

  it('id に "road" を含む → "road"', () => {
    expect(guessLayerType(layer({ id: 'road-line', type: 'line' }))).toBe('road');
  });

  it('id に "highway" を含む → "road"', () => {
    expect(guessLayerType(layer({ id: 'highway-main', type: 'line' }))).toBe('road');
  });

  it('id に "道路" を含む → "road"', () => {
    expect(guessLayerType(layer({ id: '道路-line', type: 'line' }))).toBe('road');
  });

  it('id に "background" を含む → "background"', () => {
    expect(guessLayerType(layer({ id: 'background', type: 'background' }))).toBe('background');
  });

  it('id に "bg" を含む → "background"', () => {
    expect(guessLayerType(layer({ id: 'bg-layer', type: 'background' }))).toBe('background');
  });

  it('id に "背景" を含む → "background"', () => {
    expect(guessLayerType(layer({ id: '背景-fill', type: 'fill' }))).toBe('background');
  });

  it('それ以外は "other"', () => {
    expect(guessLayerType(layer({ id: 'park-fill', type: 'fill' }))).toBe('other');
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

describe('replaceColorValue', () => {
  it('hex 文字列 → テーマカラーに置換', () => {
    expect(replaceColorValue('#aabbcc', '#ff0000')).toBe('#ff0000');
  });

  it('rgba 文字列 → hex 変換後にテーマカラーに置換 (line 34)', () => {
    expect(replaceColorValue('rgba(255, 0, 0, 1)', '#00ff00')).toBe('#00ff00');
  });

  it('hsl 文字列 → テーマカラーに置換', () => {
    expect(replaceColorValue('hsl(120, 100%, 50%)', '#0000ff')).toBe('#0000ff');
  });

  it('配列はそのまま返す', () => {
    const arr = ['match', ['get', 'type'], 'foo', '#fff', '#000'];
    expect(replaceColorValue(arr, '#ff0000')).toBe(arr);
  });

  it('色でない文字列はそのまま返す (line 50)', () => {
    expect(replaceColorValue('visible', '#ff0000')).toBe('visible');
  });

  it('数値はそのまま返す', () => {
    expect(replaceColorValue(42, '#ff0000')).toBe(42);
  });
});

describe('getLuminance', () => {
  it('6桁 hex (#ffffff) → 1.0', () => {
    expect(getLuminance('#ffffff')).toBeCloseTo(1.0, 3);
  });

  it('3桁 hex (#fff) → 6桁と同じ輝度', () => {
    expect(getLuminance('#fff')).toBeCloseTo(getLuminance('#ffffff'), 10);
  });

  it('#000000 → 0', () => {
    expect(getLuminance('#000000')).toBeCloseTo(0, 10);
  });
});

describe('getBrightestColor', () => {
  it('primary のみ → primary を返す', () => {
    expect(getBrightestColor({ primary: '#ff0000' })).toBe('#ff0000');
  });

  it('複数色のうち最も明るい色を返す', () => {
    const theme: ThemeColorsType = { primary: '#000000', secondary: '#ffffff', tertiary: '#888888' };
    expect(getBrightestColor(theme)).toBe('#ffffff');
  });

  it('primary が空文字 (colors 長 0) → #ffffff フォールバック', () => {
    // ThemeColorsType は primary: string だが空文字を渡すと filter(!!c) で除外される
    const theme = { primary: '' } as ThemeColorsType;
    expect(getBrightestColor(theme)).toBe('#ffffff');
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
      {
        id: 'road-label',
        type: 'symbol',
        layout: { 'text-field': '{name}' },
        // layout が定義されている → layout をそのまま使うブランチのテスト
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

  it('layout が定義されているレイヤーはその layout を保持する', async () => {
    const theme: ThemeColorsType = { primary: '#ff0000' };
    const result = await generateStyleFromTheme(theme, baseStyle);

    const roadLabel = result.layers.find(l => l.id === 'road-label');
    expect(roadLabel?.layout).toEqual({ 'text-field': '{name}' });
  });

  it('元のスタイルを変更しない (イミュータブル)', async () => {
    const theme: ThemeColorsType = { primary: '#ff0000' };
    const originalColor = (baseStyle.layers[1].paint as Record<string, unknown>)['fill-color'];
    await generateStyleFromTheme(theme, baseStyle);
    expect((baseStyle.layers[1].paint as Record<string, unknown>)['fill-color']).toBe(originalColor);
  });
});
