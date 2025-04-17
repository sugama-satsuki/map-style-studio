import React, { useEffect, useRef } from 'react';
import { MapStyleCreator } from '../../src';
import { createRoot } from 'react-dom/client';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'; // MapLibreのCSSをインポート

const Demo = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current, // 地図を表示するコンテナ
        style: 'https://demotiles.maplibre.org/style.json', // MapLibreのスタイルURL
        center: [139.6917, 35.6895], // 初期表示の中心座標（東京）
        zoom: 10, // 初期ズームレベル
      });

      return () => {
        map.remove(); // コンポーネントがアンマウントされたときに地図を削除
      };
    }
  }, []);

  return (
    <div className="layout">
      <div className="layout__map-area" ref={mapContainerRef}>
        {/* 地図がここに表示されます */}
      </div>
      <div className="layout__form-area">
        <h1 className="layout__title">MAP STYLE CREATER</h1>
        <MapStyleCreator />
      </div>
    </div>
  );
};

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<Demo />);
