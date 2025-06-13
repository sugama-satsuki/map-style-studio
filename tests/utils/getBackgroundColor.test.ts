import { getBackgroundColor } from '../../src/utils/generateStyleFromTheme';

describe('getBackgroundColor', () => {
  it('赤系(#ff0000)は明度が上がる', () => {
    expect(getBackgroundColor('#ff0000')).toBe('#ff5c5c');
  });
  it('黄色系(#ffff00)は明度が上がるが白にはならない', () => {
    expect(getBackgroundColor('#ffff00')).toMatch(/^#ffff/); // 明るい黄色
    expect(getBackgroundColor('#ffff00')).not.toBe('#ffffff');
  });
  it('既に明るい色は最大0.93まで', () => {
    expect(getBackgroundColor('#ffffff')).toBe('#ededed');
  });
  it('不正な値は白', () => {
    expect(getBackgroundColor('')).toBe('#ededed');
  });
});
