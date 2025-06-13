import { getLuminance } from '../../src/utils/generateStyleFromTheme';

// 明るさの判定
describe('getLuminance', () => {
  it('#000000 → 0', () => {
    expect(getLuminance('#000000')).toBeCloseTo(0);
  });
  it('#ffffff → 1', () => {
    expect(getLuminance('#ffffff')).toBeCloseTo(1);
  });
  it('#ff0000（赤）より #ffff00（黄）の方が明るい', () => {
    expect(getLuminance('#ff0000')).toBeLessThan(getLuminance('#ffff00'));
  });
});
