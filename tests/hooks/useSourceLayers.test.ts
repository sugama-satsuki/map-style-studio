import { renderHook, act, waitFor } from '@testing-library/react';
import { useSourceLayers } from '../../src/hooks/useSourceLayers';

describe('useSourceLayers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期状態: loading=false, layers=[], error=null', () => {
    const { result } = renderHook(() => useSourceLayers('https://example.com/tilejson.json'));
    expect(result.current.loading).toBe(false);
    expect(result.current.layers).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('fetchLayers 成功 (vector_layers あり) → layers がセットされる', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({
        vector_layers: [{ id: 'layer1' }, { id: 'layer2' }, { id: 'layer3' }],
      }),
    }) as jest.Mock;

    const { result } = renderHook(() => useSourceLayers('https://example.com/tilejson.json'));

    await act(async () => {
      await result.current.fetchLayers();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.layers).toEqual(['layer1', 'layer2', 'layer3']);
    expect(result.current.error).toBeNull();
  });

  it('fetchLayers 成功 (vector_layers なし) → error がセットされる', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ tiles: ['https://example.com/{z}/{x}/{y}.pbf'] }),
    }) as jest.Mock;

    const { result } = renderHook(() => useSourceLayers('https://example.com/tilejson.json'));

    await act(async () => {
      await result.current.fetchLayers();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.layers).toEqual([]);
    expect(result.current.error).toBe('vector_layersが見つかりません');
  });

  it('fetchLayers ネットワークエラー → error がセットされる', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error')) as jest.Mock;

    const { result } = renderHook(() => useSourceLayers('https://example.com/tilejson.json'));

    await act(async () => {
      await result.current.fetchLayers();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toContain('取得に失敗しました');
    expect(result.current.layers).toEqual([]);
  });

  it('fetchLayers 実行中は loading が true になる', async () => {
    let resolveJson!: (value: unknown) => void;
    const jsonPromise = new Promise(resolve => { resolveJson = resolve; });

    global.fetch = jest.fn().mockResolvedValue({
      json: () => jsonPromise,
    }) as jest.Mock;

    const { result } = renderHook(() => useSourceLayers('https://example.com/tilejson.json'));

    // fetchLayers を開始 (完了を待たない)
    act(() => {
      result.current.fetchLayers();
    });

    // loading が true になっているはず
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    // 完了させる
    await act(async () => {
      resolveJson({ vector_layers: [] });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
