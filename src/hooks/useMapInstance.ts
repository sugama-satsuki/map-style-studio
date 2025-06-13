import { useEffect, useRef } from 'react';
import maplibregl, { type StyleSpecification } from 'maplibre-gl';
import { useAtom } from 'jotai';
import { mapAtom } from '../atom';

export function useMapInstance(
  containerRef: React.RefObject<HTMLDivElement | null>,
  style?: StyleSpecification
) {
  const [map, setMap] = useAtom(mapAtom);
  const prevStyleRef = useRef<StyleSpecification | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current || !style) return;

    const mapObj = new maplibregl.Map({
      container: containerRef.current,
      style,
      center: [139.767, 35.681],
      zoom: 10,
      hash: true,
    });

    mapObj.on('load', () => {
      prevStyleRef.current = style;
      setMap(mapObj);
    });
    
    return () => {
      mapObj?.remove();
    };
    
  }, [containerRef, setMap, style]);

  useEffect(() => {
    if (map && style && prevStyleRef.current !== style) {
      map.once('styledata', () => {
        prevStyleRef.current = style;
      });
      map.setStyle(style);
    }
  }, [map, style]);

  return map;
}

export default useMapInstance;
