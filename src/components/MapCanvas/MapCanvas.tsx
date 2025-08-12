import React, { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { styleAtom } from '../../atom';
import useMapInstance from '../../hooks/useMapInstance';
import { useMapPopup } from '../../hooks/useMapPopup';
import MapPopup from '../MapPopup/MapPopup';


const MapCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const style = useAtomValue(styleAtom);

  // mapインスタンスを生成
  const map = useMapInstance(containerRef, style);

  const { popupInfo, setPopupInfo } = useMapPopup(map);

  useEffect(() => {
    console.log('Map style set:', style, map, containerRef.current);
  }, [map, style]);

  return (
    <div style={{ position: 'relative' }} className="full-all">
      <div data-testid="map-container" className="full-all" ref={containerRef} />
      {popupInfo && (
        <MapPopup
          lngLat={popupInfo.lngLat}
          point={popupInfo.point}
          properties={popupInfo.properties}
          onClose={() => setPopupInfo(null)}
        />
      )}
    </div>
  );
};

export default React.memo(MapCanvas);