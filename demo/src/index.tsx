import React, { useEffect, useRef, useState } from 'react';
import { MapStyleCreator } from '../../src';
import { createRoot } from 'react-dom/client';
import maplibregl, { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'; // MapLibreのCSSをインポート

const Demo = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [mapStyle, setMapStyle] = useState<StyleSpecification | undefined>(undefined);

  useEffect(() => {
    if (mapContainerRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current, // 地図を表示するコンテナ
        style: mapStyle, // MapLibreのスタイルURL
        center: [139.6917, 35.6895], // 初期表示の中心座標（東京）
        zoom: 10, // 初期ズームレベル
      });

      map.on('load', () => {
        setMapStyle(map.getStyle());
      });

      return () => {
        map.remove(); // コンポーネントがアンマウントされたときに地図を削除
      };
    }
  }, []);

  return (
    <div className="layout">
      <div className="layout__map-area" ref={mapContainerRef}>
      </div>
      <div className="layout__form-area">
        <h1 className="layout__title">
            <span>MAP</span>
            <span>STYLE</span>
            <span>CREATER</span>
        </h1>
        <MapStyleCreator mapStyle={mapStyle}/>
      </div>
    </div>
  );
};

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<Demo />);
