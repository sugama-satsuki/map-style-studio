import { renderHook, act } from '@testing-library/react';
import useMapInstance from '../../src/hooks/useMapInstance';
import type { StyleSpecification } from 'maplibre-gl';

// maplibre-gl をモック
const mockMapInstance = {
  once: jest.fn(),
  getCenter: jest.fn().mockReturnValue([139.767, 35.681]),
  getZoom: jest.fn().mockReturnValue(10),
  getStyle: jest.fn().mockReturnValue({ version: 8, sources: {}, layers: [] }),
  remove: jest.fn(),
};

jest.mock('maplibre-gl', () => ({
  __esModule: true,
  default: {
    Map: jest.fn().mockImplementation(() => mockMapInstance),
  },
}));

const dummyStyle: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [],
};

describe('useMapInstance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMapInstance.once.mockImplementation((event: string, cb: () => void) => {
      if (event === 'load') cb();
    });
  });

  it('containerRef が null の場合は Map を作成しない', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const maplibregl = require('maplibre-gl').default;
    const containerRef = { current: null } as React.RefObject<HTMLDivElement | null>;
    renderHook(() => useMapInstance(containerRef, dummyStyle));
    expect(maplibregl.Map).not.toHaveBeenCalled();
  });

  it('style が undefined の場合は Map を作成しない', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const maplibregl = require('maplibre-gl').default;
    const containerRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement | null>;
    renderHook(() => useMapInstance(containerRef, undefined));
    expect(maplibregl.Map).not.toHaveBeenCalled();
  });

  it('containerRef と style が揃ったとき Map を作成する', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const maplibregl = require('maplibre-gl').default;
    const containerRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement | null>;

    act(() => {
      renderHook(() => useMapInstance(containerRef, dummyStyle));
    });

    expect(maplibregl.Map).toHaveBeenCalledWith(
      expect.objectContaining({ container: containerRef.current, style: dummyStyle })
    );
  });

  it('style が string のとき getStyle() が呼ばれる', () => {
    const containerRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement | null>;
    const styleUrl = 'https://example.com/style.json';

    act(() => {
      renderHook(() => useMapInstance(containerRef, styleUrl));
    });

    expect(mockMapInstance.getStyle).toHaveBeenCalled();
  });

  it('アンマウント時に map.remove() が呼ばれる', () => {
    const containerRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement | null>;

    const { unmount } = renderHook(() => useMapInstance(containerRef, dummyStyle));

    act(() => {
      unmount();
    });

    expect(mockMapInstance.remove).toHaveBeenCalled();
  });
});
