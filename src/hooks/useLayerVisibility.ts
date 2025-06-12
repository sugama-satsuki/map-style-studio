import { useCallback, useState } from 'react';

/**
 * レイヤーの表示/非表示を管理するカスタムフック
 * @param map maplibre-glのmapインスタンス（useRefで渡す）
 * @returns { isVisible, toggleVisibility }
 */
export function useLayerVisibility(map: maplibregl.Map | null, layerId: string) {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // 表示/非表示を切り替える
  const toggleVisibility = useCallback(() => {
    if (!map || !layerId) { return; }
    if (!map.getLayer(layerId)) { return; }
    
    const current = map.getLayoutProperty(layerId, 'visibility');
    const next = current === 'none' ? 'visible' : 'none';
    map.setLayoutProperty(layerId, 'visibility', next);
    setIsVisible(next === 'visible');
  }, [map, layerId]);

  return { isVisible, toggleVisibility };
}
