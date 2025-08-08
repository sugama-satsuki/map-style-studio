import React, { useRef } from 'react';
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

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div data-testid="map-container" style={{ width: '100%', height: '100%' }} ref={containerRef} />
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