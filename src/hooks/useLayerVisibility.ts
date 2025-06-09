import { useCallback, useEffect, useState } from 'react';

/**
 * レイヤーの表示/非表示を管理するカスタムフック
 * @param mapRef maplibre-glのmapインスタンス（useRefで渡す）
 * @returns { isVisible, toggleVisibility }
 */
export function useLayerVisibility(mapRef: maplibregl.Map | null, layerId: string) {
  const [isVisible, setIsVisible] = useState(true);

  // レイヤーの可視状態を取得
  useEffect(() => {
    const map = mapRef;
    if (!map || !map.getLayer(layerId)) return;
    const visibility = map.getLayoutProperty(layerId, 'visibility');
    setIsVisible(visibility !== 'none');
  }, [mapRef, layerId]);

  // 表示/非表示を切り替える
  const toggleVisibility = useCallback(() => {
    const map = mapRef;
    if (!map || !map.getLayer(layerId)) return;
    const current = map.getLayoutProperty(layerId, 'visibility');
    const next = current === 'none' ? 'visible' : 'none';
    map.setLayoutProperty(layerId, 'visibility', next);
    setIsVisible(next === 'visible');
  }, [mapRef, layerId]);

  return { isVisible, toggleVisibility };
}
