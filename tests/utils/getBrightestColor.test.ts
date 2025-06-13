import { getBrightestColor } from '../../src/utils/generateStyleFromTheme';

describe('getBrightestColor', () => {
  it('黄色が一番明るい', () => {
    expect(getBrightestColor({ primary: '#DA291C', secondary: '#FFC72C', tertiary: '#3E3E3E' })).toBe('#FFC72C');
  });
  it('primaryだけならprimary', () => {
    expect(getBrightestColor({ primary: '#123456' })).toBe('#123456');
  });
  it('全て未定義なら白', () => {
    expect(getBrightestColor({ primary: '', secondary: '', tertiary: '' })).toBe('#ffffff');
  });
});
