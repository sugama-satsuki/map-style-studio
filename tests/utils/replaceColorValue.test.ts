import { replaceColorValue } from '../../src/utils/generateStyleFromTheme';

describe('replaceColorValue', () => {
  const themeColor = '#123456';

  it('HEXカラーはテーマカラーに置換', () => {
    expect(replaceColorValue('#ff0000', themeColor)).toBe(themeColor);
  });

  it('rgb形式はHEXに変換後テーマカラーに置換', () => {
    expect(replaceColorValue('rgb(255,0,0)', themeColor)).toBe(themeColor);
  });

  it('rgba形式はHEXに変換後テーマカラーに置換', () => {
    expect(replaceColorValue('rgba(255,255,255,0.5)', themeColor)).toBe(themeColor);
  });

  it('hsl形式はテーマカラーに置換', () => {
    expect(replaceColorValue('hsl(0,100%,50%)', themeColor)).toBe(themeColor);
  });

  it('配列はそのまま返す', () => {
    expect(replaceColorValue([1, 2, 3], themeColor)).toEqual([1, 2, 3]);
  });

  it('その他の文字列はそのまま返す', () => {
    expect(replaceColorValue('not-a-color', themeColor)).toBe('not-a-color');
  });

  it('数値はそのまま返す', () => {
    expect(replaceColorValue(123, themeColor)).toBe(123);
  });

  it('nullはそのまま返す', () => {
    expect(replaceColorValue(null, themeColor)).toBe(null);
  });
});
