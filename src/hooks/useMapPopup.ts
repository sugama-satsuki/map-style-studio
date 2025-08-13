import { useCallback, useEffect, useState } from 'react';
import type { Map as MapLibreMap, MapMouseEvent } from 'maplibre-gl';

export interface MapPopupInfo {
  lngLat: [number, number];
  point: { x: number; y: number };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: Record<string, any>[];
}

export function useMapPopup(map: MapLibreMap | null) {
  const [popupInfo, setPopupInfo] = useState<MapPopupInfo | null>(null);

  const handleClick = useCallback((e: MapMouseEvent) => {
    const features = map?.queryRenderedFeatures(e.point);
    console.log('Clicked features:', features);

    if (features && features.length > 0) {
      setPopupInfo({
        lngLat: [e.lngLat.lng, e.lngLat.lat],
        point: { x: e.point.x, y: e.point.y },
        properties: features.map(f => ({
          layerId: f.layer.id,
          properties: f.properties || {},
        })),
      });
    } else {
      setPopupInfo(null);
    }
  }, [map]);

  useEffect(() => {
    if (!map) { return; }
    
    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };

  }, [map, handleClick]);

  return { popupInfo, setPopupInfo };
}
