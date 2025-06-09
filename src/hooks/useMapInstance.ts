import { useRef, useEffect } from 'react';
import maplibregl, { Map as MapLibreMap, type StyleSpecification } from 'maplibre-gl';
import { useSetAtom } from 'jotai';
import { mapRefAtom } from '../atom';

export function useMapInstance(
  containerRef: React.RefObject<HTMLDivElement | null>,
  style?: StyleSpecification
) {
  const mapRef = useRef<MapLibreMap | null>(null);
  const setMapRef = useSetAtom(mapRefAtom);

  useEffect(() => {
    if (!containerRef.current || !style) return;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style,
      center: [139.767, 35.681],
      zoom: 10,
    });
    
    setMapRef(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    
  }, [containerRef, style]);

  useEffect(() => {
    if (mapRef.current && style) {
      mapRef.current.setStyle(style);
    }
  }, [style]);

  return mapRef;
}

export default useMapInstance;
