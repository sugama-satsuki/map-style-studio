import { useEffect } from 'react';
import maplibregl, { type StyleSpecification } from 'maplibre-gl';
import { useAtom } from 'jotai';
import { mapAtom } from '../atom';

export function useMapInstance(
  containerRef: React.RefObject<HTMLDivElement | null>,
  style?: StyleSpecification
) {
  const [map, setMap] = useAtom(mapAtom);

  useEffect(() => {
    if (!containerRef.current || !style) return;

    const mapObj = new maplibregl.Map({
      container: containerRef.current,
      style,
      center: [139.767, 35.681],
      zoom: 10,
      hash: true,
    });
    
    setMap(mapObj);

    return () => {
      mapObj?.remove();
    };
    
  }, [containerRef, setMap, style]);

  useEffect(() => {
    if (map && style) {
      map.setStyle(style);
    }
  }, [map, style]);

  return map;
}

export default useMapInstance;
