import { renderHook } from '@testing-library/react';
import useMapInstance from '../../src/hooks/useMapInstance';
import { StyleSpecification } from 'maplibre-gl';

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
});
