import { getSourcesFromStyle } from '../../src/utils/sourceUtils'; 
import type { StyleSpecification } from 'maplibre-gl';

describe('getSourcesFromStyle', () => {
  it('複数のsourceに複数レイヤーがある場合、正しく分割される', () => {
    const style: StyleSpecification = {
      version: 8,
      sources: {
        water: { type: 'vector' },
        land: { type: 'vector' },
      },
      layers: [
        { id: 'water-fill', type: 'fill', source: 'water' },
        { id: 'water-line', type: 'line', source: 'water' },
        { id: 'land-fill', type: 'fill', source: 'land' },
      ],
    };
    expect(getSourcesFromStyle(style)).toEqual({
      water: ['water-fill', 'water-line'],
      land: ['land-fill'],
    });
  });

  it('sourceがないレイヤーは無視される', () => {
    const style: StyleSpecification = {
      version: 8,
      sources: {},
      layers: [
        { id: 'background', type: 'background' },
        { id: 'water', type: 'fill', source: 'water' },
      ],
    };
    expect(getSourcesFromStyle(style)).toEqual({
      water: ['water'],
    });
  });

  it('layersが空の場合は空オブジェクト', () => {
    const style: StyleSpecification = {
      version: 8,
      sources: {},
      layers: [],
    };
    expect(getSourcesFromStyle(style)).toEqual({});
  });
});
