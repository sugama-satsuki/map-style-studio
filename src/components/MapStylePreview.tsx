import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Slider, Space } from 'antd';
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

  const [brightness, setBrightness] = useState(100); // 明度（初期値100%）
  const [saturation, setSaturation] = useState(100); // 彩度（初期値100%）

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

  // 明度・彩度の調整を反映
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setPaintProperty('background', 'background-brightness', brightness / 100);
      mapRef.current.setPaintProperty('background', 'background-saturation', saturation / 100);
    }
  }, [brightness, saturation]);

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
      <Space direction="vertical" size="large" className="flex">
        <div>
          <label>明度</label>
          <Slider
            min={0}
            max={200}
            value={brightness}
            onChange={(value: number) => setBrightness(value)}
            tooltip={{ formatter: (value) => `${value}%` }}
          />
        </div>
        <div>
          <label>彩度</label>
          <Slider
            min={0}
            max={200}
            value={saturation}
            onChange={(value: number) => setSaturation(value)}
            tooltip={{ formatter: (value) => `${value}%` }}
          />
        </div>
      </Space>
    </Modal>
  );
};

export default MapStylePreview;