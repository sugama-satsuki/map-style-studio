import { useEffect, useState } from 'react';
import type { Map as MapLibreMap, MapMouseEvent } from 'maplibre-gl';

export interface MapPopupInfo {
  lngLat: [number, number];
  point: { x: number; y: number };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: Record<string, any>[];
}

export function useMapPopup(mapRef: React.MutableRefObject<MapLibreMap | null>) {
  const [popupInfo, setPopupInfo] = useState<MapPopupInfo | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    console.log('useMapPopup: mapRef.current', map);
    if (!map) return;

    const handleClick = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point);
      console.log('Clicked features:', features);
      if (features.length > 0) {
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
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [mapRef]);

  return { popupInfo, setPopupInfo };
}
