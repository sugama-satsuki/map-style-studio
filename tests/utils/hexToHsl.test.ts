import { hexToHsl } from '../../src/utils/colorHelpers';

// hexをHSLに変換する
describe('hexToHsl', () => {
  it('#ff0000 → [0, 1, 0.5]', () => {
    const [h, s, l] = hexToHsl('#ff0000');
    expect(Math.round(h)).toBe(0);
    expect(Math.round(s * 100)).toBe(100);
    expect(Math.round(l * 100)).toBe(50);
  });
  it('#00ff00 → [120, 1, 0.5]', () => {
    const [h, s, l] = hexToHsl('#00ff00');
    expect(Math.round(h)).toBe(120);
    expect(Math.round(s * 100)).toBe(100);
    expect(Math.round(l * 100)).toBe(50);
  });
  it('#0000ff → [240, 1, 0.5]', () => {
    const [h, s, l] = hexToHsl('#0000ff');
    expect(Math.round(h)).toBe(240);
    expect(Math.round(s * 100)).toBe(100);
    expect(Math.round(l * 100)).toBe(50);
  });
  it('3桁のhexも変換できる', () => {
    const [h, s, l] = hexToHsl('#f00');
    expect(Math.round(h)).toBe(0);
    expect(Math.round(s * 100)).toBe(100);
    expect(Math.round(l * 100)).toBe(50);
  });
  it('r が max かつ g < b のケース (ピンク系) → h が 300 度台', () => {
    // #ff3366: r=255, g=51, b=102 → r is max, g < b → case r の g<b?6:0 の 6 が使われる
    const [h] = hexToHsl('#ff3366');
    expect(h).toBeGreaterThan(330);
    expect(h).toBeLessThan(360);
  });
  it('不正な値は白', () => {
    expect(hexToHsl('')).toEqual([0, 0, 1]);
  });
});
