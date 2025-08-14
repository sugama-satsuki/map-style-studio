import { adjustSaturation } from '../../src/utils/colorAdjustUtils';

describe('adjustSaturation', () => {
  it('彩度を変更すると色が変化すること（グレー→色味が強くなる）', () => {
    const gray = '#888888';
    const saturated = adjustSaturation(gray, 100);
    expect(saturated).not.toBe(gray);
  });

  it('彩度0でグレーになること', () => {
    const color = '#ff8800'; // オレンジ
    const desaturated = adjustSaturation(color, -100);
    // グレー系の色になるはず
    expect(/^#([0-9a-f]{6})$/i.test(desaturated)).toBe(true);
    // R=G=Bに近い値になる
    const r = parseInt(desaturated.slice(1, 3), 16);
    const g = parseInt(desaturated.slice(3, 5), 16);
    const b = parseInt(desaturated.slice(5, 7), 16);
    console.log(`Desaturated color: ${desaturated} (R: ${r}, G: ${g}, B: ${b})`);
    expect(Math.abs(r - g)).toBeLessThan(10);
    expect(Math.abs(g - b)).toBeLessThan(10);
    expect(Math.abs(r - b)).toBeLessThan(10);
  });

  it('彩度最大でも純色は変化しない（例: #ff0000）', () => {
    const red = '#ff0000';
    const saturated = adjustSaturation(red, 100);
    expect(saturated).toBe(red);
  });
});
