import { groupLayersByType } from '../../src/utils/layerControl';
import type { LayerSpecification } from 'maplibre-gl';

// source が必須の型を回避するヘルパー
function layer(obj: Record<string, unknown>): LayerSpecification {
  return obj as unknown as LayerSpecification;
}

describe('groupLayersByType', () => {
  it('circle / line / fill / symbol を正しいグループに分類する', () => {
    const layers: LayerSpecification[] = [
      layer({ id: 'c1', type: 'circle' }),
      layer({ id: 'l1', type: 'line' }),
      layer({ id: 'f1', type: 'fill' }),
      layer({ id: 's1', type: 'symbol' }),
    ];
    const result = groupLayersByType(layers);

    expect(result.circle.map(l => l.id)).toEqual(['c1']);
    expect(result.line.map(l => l.id)).toEqual(['l1']);
    expect(result.fill.map(l => l.id)).toEqual(['f1']);
    expect(result.symbol.map(l => l.id)).toEqual(['s1']);
    expect(result.other).toHaveLength(0);
  });

  it('未知のタイプ (raster, background など) は other に分類される', () => {
    const layers: LayerSpecification[] = [
      layer({ id: 'r1', type: 'raster' }),
      layer({ id: 'bg1', type: 'background' }),
      layer({ id: 'fe1', type: 'fill-extrusion' }),
    ];
    const result = groupLayersByType(layers);

    expect(result.other).toHaveLength(3);
    expect(result.other.map(l => l.id)).toEqual(['r1', 'bg1', 'fe1']);
    expect(result.circle).toHaveLength(0);
    expect(result.line).toHaveLength(0);
    expect(result.fill).toHaveLength(0);
    expect(result.symbol).toHaveLength(0);
  });

  it('空配列では全グループが空', () => {
    const result = groupLayersByType([]);
    expect(result.circle).toHaveLength(0);
    expect(result.line).toHaveLength(0);
    expect(result.fill).toHaveLength(0);
    expect(result.symbol).toHaveLength(0);
    expect(result.other).toHaveLength(0);
  });

  it('同一タイプが複数あっても正しくグループ化される', () => {
    const layers: LayerSpecification[] = [
      layer({ id: 'l1', type: 'line' }),
      layer({ id: 'l2', type: 'line' }),
      layer({ id: 'l3', type: 'line' }),
    ];
    const result = groupLayersByType(layers);
    expect(result.line).toHaveLength(3);
  });
});
