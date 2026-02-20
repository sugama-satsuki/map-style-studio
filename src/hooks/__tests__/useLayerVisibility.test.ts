import { renderHook, act } from '@testing-library/react';
import { useLayerVisibility } from '../useLayerVisibility';
import type maplibregl from 'maplibre-gl';

// モックMapクラス
class MockMap {
  private layers: Record<string, { visibility: 'visible' | 'none' }> = {};
  constructor(layers: string[] = []) {
    layers.forEach(id => {
      this.layers[id] = { visibility: 'visible' };
    });
  }
  getLayer(id: string) {
    return this.layers[id] ? { id } : undefined;
  }
  getLayoutProperty(id: string, prop: string) {
    if (prop === 'visibility' && this.layers[id]) {
      return this.layers[id].visibility;
    }
    return undefined;
  }
  setLayoutProperty(id: string, prop: string, value: any) {
    if (prop === 'visibility' && this.layers[id]) {
      this.layers[id].visibility = value;
    }
  }
}

describe('useLayerVisibility', () => {
  it('初期状態でisVisibleがtrue', () => {
    const map = new MockMap(['foo']) as unknown as maplibregl.Map;
    const { result } = renderHook(() => useLayerVisibility(map, 'foo'));
    expect(result.current.isVisible).toBe(true);
  });

  it('toggleVisibilityでvisible→none→visibleと切り替わる', () => {
    const map = new MockMap(['foo']) as unknown as maplibregl.Map;
    const { result } = renderHook(() => useLayerVisibility(map, 'foo'));
    act(() => {
      result.current.toggleVisibility();
    });
    expect(map.getLayoutProperty('foo', 'visibility')).toBe('none');
    act(() => {
      result.current.toggleVisibility();
    });
    expect(map.getLayoutProperty('foo', 'visibility')).toBe('visible');
  });

  it('mapがnullの場合は何もしない', () => {
    const { result } = renderHook(() => useLayerVisibility(null, 'foo'));
    expect(result.current.isVisible).toBe(true);
    act(() => {
      result.current.toggleVisibility();
    });
    // エラーにならず何も起きない
    expect(result.current.isVisible).toBe(true);
  });

  it('存在しないlayerIdの場合は何もしない', () => {
    const map = new MockMap(['foo']) as unknown as maplibregl.Map;
    const { result } = renderHook(() => useLayerVisibility(map, 'bar'));
    expect(result.current.isVisible).toBe(true);
    act(() => {
      result.current.toggleVisibility();
    });
    // fooしかないのでbarは何も起きない
    expect(result.current.isVisible).toBe(true);
  });
});
