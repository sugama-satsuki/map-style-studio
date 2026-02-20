import { renderHook, act } from '@testing-library/react';
import useMapInstance from '../../src/hooks/useMapInstance';
import type { StyleSpecification } from 'maplibre-gl';

// window.geolonia をモック (CDN経由のGeolonia Mapsの代替)
const mockMapInstance = {
  once: jest.fn(),
  getCenter: jest.fn().mockReturnValue([139.767, 35.681]),
  getZoom: jest.fn().mockReturnValue(10),
  getStyle: jest.fn().mockReturnValue({ version: 8, sources: {}, layers: [] }),
  remove: jest.fn(),
};

const MockGeoloniaMap = jest.fn().mockImplementation(() => mockMapInstance);

Object.defineProperty(window, 'geolonia', {
  value: { Map: MockGeoloniaMap },
  writable: true,
});

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
    const containerRef = { current: null } as React.RefObject<HTMLDivElement | null>;
    renderHook(() => useMapInstance(containerRef, dummyStyle));
    expect(MockGeoloniaMap).not.toHaveBeenCalled();
  });

  it('style が undefined の場合は Map を作成しない', () => {
    const containerRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement | null>;
    renderHook(() => useMapInstance(containerRef, undefined));
    expect(MockGeoloniaMap).not.toHaveBeenCalled();
  });

  it('containerRef と style が揃ったとき Map を作成する', () => {
    const containerRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement | null>;

    act(() => {
      renderHook(() => useMapInstance(containerRef, dummyStyle));
    });

    expect(MockGeoloniaMap).toHaveBeenCalledWith(
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
