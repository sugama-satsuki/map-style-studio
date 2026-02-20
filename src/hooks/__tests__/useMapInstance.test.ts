import { renderHook } from '@testing-library/react';
import useMapInstance from '../useMapInstance';
import type { StyleSpecification } from 'maplibre-gl';

vi.mock('maplibre-gl', () => ({
  default: {
    Map: class {
      on = vi.fn();
      once = vi.fn();
      off = vi.fn();
      remove = vi.fn();
      getCenter = vi.fn(() => ({ lng: 139.767, lat: 35.681 }));
      getZoom = vi.fn(() => 10);
      getStyle = vi.fn(() => ({ version: 8, sources: {}, layers: [] }));
    },
  },
}));

describe('useMapInstance', () => {
  test('フックが正常に呼び出せる', () => {
    const containerRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement>;
    const dummyStyle: StyleSpecification = {
      version: 8,
      sources: {},
      layers: []
    };
    const { result } = renderHook(() => useMapInstance(containerRef, dummyStyle));
    expect(result.current).toBeDefined();
  });

  test('containerRef が null の場合は Map を作成しない', () => {
    const containerRef = { current: null } as React.RefObject<HTMLDivElement>;
    const { result } = renderHook(() => useMapInstance(containerRef));
    expect(result.current).toBeNull();
  });

  test('style が undefined の場合は Map を作成しない', () => {
    const containerRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement>;
    const { result } = renderHook(() => useMapInstance(containerRef, undefined));
    expect(result.current).toBeNull();
  });
});
