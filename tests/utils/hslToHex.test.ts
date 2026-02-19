import { hslToHex } from '../../src/utils/colorHelpers';

// hslをhexに変換する
describe('hslToHex', () => {
  it('[0,1,0.5] → #ff0000', () => {
    expect(hslToHex(0, 1, 0.5)).toBe('#ff0000');
  });
  it('[120,1,0.5] → #00ff00', () => {
    expect(hslToHex(120, 1, 0.5)).toBe('#00ff00');
  });
  it('[240,1,0.5] → #0000ff', () => {
    expect(hslToHex(240, 1, 0.5)).toBe('#0000ff');
  });
  it('s=0 (グレー) のケース → モノクロ', () => {
    // s=0 なので hue2rgb を呼ばずに r=g=b=l になる
    expect(hslToHex(0, 0, 0.5)).toBe('#808080');
  });
  it('l < 0.5 のケース → q = l * (1 + s) ブランチを通る', () => {
    // l=0.3 < 0.5 → q = l*(1+s) = 0.3*2 = 0.6
    const result = hslToHex(120, 1, 0.3);
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });
  it('h=270 (紫) → hue2rgb で t > 1 ブランチを通る', () => {
    // h=270: r チャンネルの t = 270/360 + 1/3 = 0.75 + 0.333 = 1.083 > 1 → t -= 1
    const result = hslToHex(270, 1, 0.5);
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });
});
