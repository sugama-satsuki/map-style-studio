import { renderHook, act } from '@testing-library/react';
import { useMapPopup } from '../../src/hooks/useMapPopup';
import type { MapMouseEvent } from 'maplibre-gl';

// モック Map クラス
class MockMap {
  private handlers: Record<string, (e: unknown) => void> = {};
  private features: unknown[] = [];

  setFeatures(features: unknown[]) {
    this.features = features;
  }

  queryRenderedFeatures(_point: unknown) {
    return this.features;
  }

  on(event: string, handler: (e: unknown) => void) {
    this.handlers[event] = handler;
  }

  off(event: string, _handler: (e: unknown) => void) {
    delete this.handlers[event];
  }

  emit(event: string, e: unknown) {
    if (this.handlers[event]) {
      this.handlers[event](e);
    }
  }
}

function makeMouseEvent(x: number, y: number, lng: number, lat: number): MapMouseEvent {
  return {
    point: { x, y },
    lngLat: { lng, lat },
  } as unknown as MapMouseEvent;
}

describe('useMapPopup', () => {
  it('初期状態では popupInfo が null', () => {
    const map = new MockMap() as unknown as maplibregl.Map;
    const { result } = renderHook(() => useMapPopup(map));
    expect(result.current.popupInfo).toBeNull();
  });

  it('map が null の場合は何もしない', () => {
    const { result } = renderHook(() => useMapPopup(null));
    expect(result.current.popupInfo).toBeNull();
  });

  it('クリックでフィーチャがある場合 → popupInfo がセットされる', () => {
    const map = new MockMap();
    map.setFeatures([
      { layer: { id: 'building-fill' }, properties: { name: 'Test Building' } },
    ]);

    const { result } = renderHook(() => useMapPopup(map as unknown as maplibregl.Map));

    act(() => {
      map.emit('click', makeMouseEvent(100, 200, 139.7, 35.6));
    });

    expect(result.current.popupInfo).not.toBeNull();
    expect(result.current.popupInfo?.lngLat).toEqual([139.7, 35.6]);
    expect(result.current.popupInfo?.point).toEqual({ x: 100, y: 200 });
    expect(result.current.popupInfo?.properties[0].layerId).toBe('building-fill');
    expect(result.current.popupInfo?.properties[0].properties).toEqual({ name: 'Test Building' });
  });

  it('フィーチャの properties が null の場合 → {} にフォールバックする', () => {
    const map = new MockMap();
    map.setFeatures([
      { layer: { id: 'test-layer' }, properties: null },  // properties が null
    ]);

    const { result } = renderHook(() => useMapPopup(map as unknown as maplibregl.Map));

    act(() => {
      map.emit('click', makeMouseEvent(10, 20, 135.0, 34.0));
    });

    expect(result.current.popupInfo?.properties[0].properties).toEqual({});
  });

  it('クリックでフィーチャがない場合 → popupInfo が null になる', () => {
    const map = new MockMap();
    map.setFeatures([{ layer: { id: 'test' }, properties: {} }]);

    const { result } = renderHook(() => useMapPopup(map as unknown as maplibregl.Map));

    // まずフィーチャありでクリック
    act(() => {
      map.emit('click', makeMouseEvent(100, 200, 139.7, 35.6));
    });
    expect(result.current.popupInfo).not.toBeNull();

    // フィーチャなしに変えてクリック
    map.setFeatures([]);
    act(() => {
      map.emit('click', makeMouseEvent(50, 50, 140.0, 35.7));
    });
    expect(result.current.popupInfo).toBeNull();
  });

  it('setPopupInfo を直接呼べる', () => {
    const map = new MockMap() as unknown as maplibregl.Map;
    const { result } = renderHook(() => useMapPopup(map));

    act(() => {
      result.current.setPopupInfo({
        lngLat: [139.0, 35.0],
        point: { x: 10, y: 20 },
        properties: [],
      });
    });
    expect(result.current.popupInfo?.lngLat).toEqual([139.0, 35.0]);
  });

  it('アンマウント時に map.off が呼ばれる', () => {
    const map = new MockMap();
    const offSpy = jest.spyOn(map, 'off');

    const { unmount } = renderHook(() => useMapPopup(map as unknown as maplibregl.Map));
    unmount();

    expect(offSpy).toHaveBeenCalledWith('click', expect.any(Function));
  });
});
