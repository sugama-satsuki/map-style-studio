import { matchLayer } from '../../src/utils/generateCategoryColorStyle';

describe('matchLayer', () => {
  it('idがパターンに一致する場合true', () => {
    const layer = { id: 'water-area', type: 'fill' } as any;
    expect(matchLayer(layer, /water/)).toBe(true);
  });

  it('source-layerがパターンに一致する場合true', () => {
    const layer = { id: 'foo', type: 'fill', 'source-layer': 'river-source' } as any;
    expect(matchLayer(layer, /river/)).toBe(true);
  });

  it('idもsource-layerも一致しない場合false', () => {
    const layer = { id: 'building', type: 'fill', 'source-layer': 'land' } as any;
    expect(matchLayer(layer, /water/)).toBe(false);
  });

  it('source-layerが無い場合もidのみ判定', () => {
    const layer = { id: 'sea', type: 'fill' } as any;
    expect(matchLayer(layer, /sea/)).toBe(true);
  });
});
