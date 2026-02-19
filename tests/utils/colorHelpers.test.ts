import {
  hexToRgb,
  rgbToHsv,
  isGreenColor,
  isRedColor,
  isYellowColor,
  isBlueColor,
  isBrownColor,
  isBlackColor,
  isWhiteColor,
} from '../../src/utils/colorHelpers';

describe('hexToRgb', () => {
  it('有効な #RRGGBB を {r,g,b} に変換する', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('大文字 HEX も変換できる', () => {
    expect(hexToRgb('#FF8800')).toEqual({ r: 255, g: 136, b: 0 });
  });

  it('# なしの HEX も変換できる', () => {
    expect(hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('無効な文字列は null を返す', () => {
    expect(hexToRgb('not-a-color')).toBeNull();
    expect(hexToRgb('')).toBeNull();
    expect(hexToRgb('#gg0000')).toBeNull();
  });
});

describe('rgbToHsv', () => {
  it('赤 (255,0,0) → h≈0, s=1, v=1', () => {
    const { h, s, v } = rgbToHsv(255, 0, 0);
    expect(h).toBeCloseTo(0, 1);
    expect(s).toBeCloseTo(1, 5);
    expect(v).toBeCloseTo(1, 5);
  });

  it('緑 (0,255,0) → h≈120, s=1, v=1', () => {
    const { h, s, v } = rgbToHsv(0, 255, 0);
    expect(h).toBeCloseTo(120, 1);
    expect(s).toBeCloseTo(1, 5);
    expect(v).toBeCloseTo(1, 5);
  });

  it('青 (0,0,255) → h≈240, s=1, v=1', () => {
    const { h, s, v } = rgbToHsv(0, 0, 255);
    expect(h).toBeCloseTo(240, 1);
    expect(s).toBeCloseTo(1, 5);
    expect(v).toBeCloseTo(1, 5);
  });

  it('白 (255,255,255) → s=0, v=1', () => {
    const { s, v } = rgbToHsv(255, 255, 255);
    expect(s).toBeCloseTo(0, 5);
    expect(v).toBeCloseTo(1, 5);
  });

  it('黒 (0,0,0) → s=0, v=0', () => {
    const { s, v } = rgbToHsv(0, 0, 0);
    expect(s).toBeCloseTo(0, 5);
    expect(v).toBeCloseTo(0, 5);
  });

  it('グレー (max===min) → h=0', () => {
    const { h } = rgbToHsv(128, 128, 128);
    expect(h).toBe(0);
  });

  it('シアン: g が max のケース', () => {
    const { h } = rgbToHsv(0, 200, 200);
    expect(h).toBeCloseTo(180, 0);
  });

  it('b が max のケース (マゼンタ寄り)', () => {
    const { h } = rgbToHsv(100, 0, 200);
    expect(h).toBeGreaterThan(240);
    expect(h).toBeLessThan(300);
  });
});

describe('isGreenColor', () => {
  it('緑色は true', () => {
    expect(isGreenColor('#00cc00')).toBe(true); // 純緑
    expect(isGreenColor('#33aa33')).toBe(true);
    expect(isGreenColor('#88cc44')).toBe(true);
  });

  it('非緑色は false', () => {
    expect(isGreenColor('#ff0000')).toBe(false); // 赤
    expect(isGreenColor('#0000ff')).toBe(false); // 青
    expect(isGreenColor('#ffffff')).toBe(false); // 白
    expect(isGreenColor('#000000')).toBe(false); // 黒
  });

  it('無効な hex は false', () => {
    expect(isGreenColor('invalid')).toBe(false);
  });
});

describe('isRedColor', () => {
  it('赤色は true', () => {
    expect(isRedColor('#ff0000')).toBe(true);
    expect(isRedColor('#cc0000')).toBe(true);
    expect(isRedColor('#ff3333')).toBe(true);
  });

  it('赤色の範囲外は false', () => {
    expect(isRedColor('#00ff00')).toBe(false);
    expect(isRedColor('#0000ff')).toBe(false);
    expect(isRedColor('#ffffff')).toBe(false);
  });

  it('無効な hex は false', () => {
    expect(isRedColor('invalid')).toBe(false);
  });
});

describe('isYellowColor', () => {
  it('黄色は true', () => {
    expect(isYellowColor('#ffff00')).toBe(true);
    expect(isYellowColor('#ffcc00')).toBe(true);
    expect(isYellowColor('#ddcc00')).toBe(true);
  });

  it('黄色でないは false', () => {
    expect(isYellowColor('#ff0000')).toBe(false);
    expect(isYellowColor('#00ff00')).toBe(false);
    expect(isYellowColor('#ffffff')).toBe(false);
  });

  it('無効な hex は false', () => {
    expect(isYellowColor('invalid')).toBe(false);
  });
});

describe('isBlueColor', () => {
  it('青色は true', () => {
    expect(isBlueColor('#0000ff')).toBe(true);
    expect(isBlueColor('#0033cc')).toBe(true);
    expect(isBlueColor('#3366ff')).toBe(true);
  });

  it('青色でないは false', () => {
    expect(isBlueColor('#ff0000')).toBe(false);
    expect(isBlueColor('#00ff00')).toBe(false);
    expect(isBlueColor('#ffffff')).toBe(false);
  });

  it('無効な hex は false', () => {
    expect(isBlueColor('invalid')).toBe(false);
  });
});

describe('isBrownColor', () => {
  it('茶色は true', () => {
    expect(isBrownColor('#8B4513')).toBe(true); // SaddleBrown
    expect(isBrownColor('#A0522D')).toBe(true); // Sienna
  });

  it('茶色でないは false', () => {
    expect(isBrownColor('#ff0000')).toBe(false);
    expect(isBrownColor('#00ff00')).toBe(false);
    expect(isBrownColor('#ffffff')).toBe(false);
    expect(isBrownColor('#ffff00')).toBe(false); // 黄色は v が高いので false
  });

  it('無効な hex は false', () => {
    expect(isBrownColor('invalid')).toBe(false);
  });
});

describe('isBlackColor', () => {
  it('黒色は true', () => {
    expect(isBlackColor('#000000')).toBe(true);
    expect(isBlackColor('#111111')).toBe(true);
    expect(isBlackColor('#0a0a0a')).toBe(true);
  });

  it('黒色でないは false', () => {
    expect(isBlackColor('#ffffff')).toBe(false);
    expect(isBlackColor('#ff0000')).toBe(false);
    expect(isBlackColor('#555555')).toBe(false);
  });

  it('無効な hex は false', () => {
    expect(isBlackColor('invalid')).toBe(false);
  });
});

describe('isWhiteColor', () => {
  it('白色は true', () => {
    expect(isWhiteColor('#ffffff')).toBe(true);
    expect(isWhiteColor('#f8f8f8')).toBe(true);
    expect(isWhiteColor('#eeeeee')).toBe(true);
  });

  it('白色でないは false', () => {
    expect(isWhiteColor('#000000')).toBe(false);
    expect(isWhiteColor('#ff0000')).toBe(false);
    expect(isWhiteColor('#cccccc')).toBe(false); // 彩度が低くても v が足りない
  });

  it('無効な hex は false', () => {
    expect(isWhiteColor('invalid')).toBe(false);
  });
});
