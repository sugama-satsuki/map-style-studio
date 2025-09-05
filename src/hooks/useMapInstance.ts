import { useEffect, useRef } from 'react';
import maplibregl, { type StyleSpecification } from 'maplibre-gl';
import { useAtom } from 'jotai';
import { mapAtom, styleAtom } from '../atom';
import MaplibreInspect from '@maplibre/maplibre-gl-inspect';
import { getSourcesFromStyle } from '../utils/sourceUtils';


export function useMapInstance(
  containerRef: React.RefObject<HTMLDivElement | null>,
  style?: StyleSpecification | string
) {
  const [map, setMap] = useAtom(mapAtom);
  const [, setStyle] = useAtom(styleAtom);
  const prevStyleRef = useRef<StyleSpecification | string | undefined>(undefined);
  const inspectRef = useRef<MaplibreInspect | null>(null);

  useEffect(() => {
    if (!containerRef.current || !style) { return; }

    const center = map?.getCenter() || [139.767, 35.681] as [number, number];
    const zoom = map?.getZoom() || 10;

    // mapオブジェクトがなければ新規生成
    const mapObj = new maplibregl.Map({
      container: containerRef.current,
      style,
      center: center,
      zoom: zoom,
      hash: true,
    });

    mapObj.once('load', () => {
      prevStyleRef.current = style;
      setMap(mapObj);

      // styleがstring（URL）の場合、map.getStyle()で取得したスタイルをatomにセット
      if (typeof style === 'string') {
        const mapStyle = mapObj.getStyle();
        setStyle(mapStyle);
      }

      inspectRef.current = new MaplibreInspect({
        sources: getSourcesFromStyle(mapObj.getStyle()),
        assignLayerColor: () => '#CC66FF',
        popup: new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false
        })
      });
      mapObj.addControl(inspectRef.current);


      console.log('Map instance created');
    });

    return () => {
      mapObj.remove();
    };
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, setMap, setStyle, style]);

  // ON/OFF切り替え関数
  const toggleInspect = (on: boolean) => {
    if (inspectRef.current) {
      if (on) {
        // inspectRef.current.onAdd();
        console.log('Inspect mode activated');
      } else {
        inspectRef.current.onRemove();
      }
    }
  };

  return {map, toggleInspect};
}

export default useMapInstance;
