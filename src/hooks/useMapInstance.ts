import { useEffect, useRef } from 'react';
import maplibregl, { type StyleSpecification } from 'maplibre-gl';
import { useAtom } from 'jotai';
import { mapAtom, styleAtom } from '../atom';

export function useMapInstance(
  containerRef: React.RefObject<HTMLDivElement | null>,
  style?: StyleSpecification | string
) {
  const [map, setMap] = useAtom(mapAtom);
  const [, setStyle] = useAtom(styleAtom);
  const prevStyleRef = useRef<StyleSpecification | string | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current || !style) { return; }
  
    if (!map) {
      // mapオブジェクトがなければ新規生成
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

        // styleがstring（URL）の場合、map.getStyle()で取得したスタイルをatomにセット
        if (typeof style === 'string') {
          const mapStyle = mapObj.getStyle();
          setStyle(mapStyle);
        }
      });

      return () => {
        mapObj.remove();
      };

    } else {
      // すでにmapオブジェクトがあればstyleだけ更新
      if (prevStyleRef.current !== style) {
        map.once('styledata', () => {
          prevStyleRef.current = style;
        });
        map.setStyle(style);
      }
    }
    
  }, [containerRef, setMap, setStyle, style]);

  return map;
}

export default useMapInstance;
