import { renderHook } from '@testing-library/react';
import useMapInstance from '../../src/hooks/useMapInstance';
import type { StyleSpecification } from 'maplibre-gl';

const mockMapInstance = {
  on: jest.fn(),
  once: jest.fn(),
  off: jest.fn(),
  remove: jest.fn(),
  getCenter: jest.fn(() => ({ lng: 139.767, lat: 35.681 })),
  getZoom: jest.fn(() => 10),
  getStyle: jest.fn(() => ({ version: 8, sources: {}, layers: [] })),
};

jest.mock('maplibre-gl', () => ({
  Map: jest.fn().mockImplementation(() => mockMapInstance),
}));

describe('useMapInstance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
