import React, { useEffect, useRef } from 'react';
import { Button, Modal } from 'antd';
import maplibregl, { LngLatLike, StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapStylePreview.css';

type MapStylePreviewProps = {
  visible: boolean;
  onClose: () => void;
  style: StyleSpecification | undefined;
};

const MapStylePreview: React.FC<MapStylePreviewProps> = ({ visible, onClose, style }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !visible || !style) { return; }
    
    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: style,
        center: style.center as LngLatLike,
        zoom: style.zoom
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [style, visible]);

  if(!visible) { return null; }

  return (
    <Modal title="地図スタイルプレビュー" 
      open={visible} 
      footer={
        <Button type="primary" onClick={onClose}>
          閉じる
        </Button>
      }
      onCancel={onClose}
    >
      <div className="map-style-preview-container" ref={mapContainerRef}></div>
    </Modal>
  );
};

export default MapStylePreview;