import React, { useRef, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { styleAtom } from '../../atom';
import useMapInstance from '../../hooks/useMapInstance';
import { useMapPopup } from '../../hooks/useMapPopup';
import MapPopup from '../MapPopup/MapPopup';
import type { LngLatLike } from 'maplibre-gl';

const DEFAULT_CENTER = [139.767, 35.681]; // 例: 東京駅
const DEFAULT_ZOOM = 12;

const MapCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const style = useAtomValue(styleAtom);

  // 緯度経度・ズームの状態を保持
  const [viewState, setViewState] = useState<{ center: number[]; zoom: number }>({
    center: style?.center ?? DEFAULT_CENTER,
    zoom: style?.zoom ?? DEFAULT_ZOOM,
  });

  // mapインスタンスを生成
  const map = useMapInstance(containerRef, style);

  // mapのviewStateを保存・復元
  useEffect(() => {
    if (!map) return;

    // styleが変わる直前のviewを保存
    const handleMove = () => {
      setViewState({
        center: map.getCenter().toArray(),
        zoom: map.getZoom(),
      });
    };
    map.on('moveend', handleMove);

    // styleが変わった直後にviewを復元
    const handleStyle = () => {
      map.setCenter(viewState.center as LngLatLike);
      map.setZoom(viewState.zoom);
    };
    map.on('styledata', handleStyle);

    // 初回マウント時にもviewを復元
    map.setCenter(viewState.center as LngLatLike);
    map.setZoom(viewState.zoom);

    return () => {
      map.off('moveend', handleMove);
      map.off('styledata', handleStyle);
    };
  }, [map]);

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