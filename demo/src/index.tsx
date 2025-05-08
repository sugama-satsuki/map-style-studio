import React, { useEffect, useRef, useState } from 'react';
import { MapColorChanger, MapLayerColorChanger } from '../../src';
import { createRoot } from 'react-dom/client';
import maplibregl, { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styleJson from './style.json';
import { Card, Col, Divider, Row, Space } from 'antd';


const Demo = () => {

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [initialMapStyle, setMapStyle] = useState<StyleSpecification | undefined>(undefined);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  const onChangeMapStyle = (newMapStyle: StyleSpecification | undefined) => {
    if(!map || !newMapStyle) { return; }
    map.setStyle(newMapStyle);
  };

  useEffect(() => {
    if (!mapContainerRef.current) { return; }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleJson as StyleSpecification,
      center: [139.6917, 35.6895],
      zoom: 10
    });

    map.on('load', () => {
      setMap(map);
      setMapStyle(map.getStyle());
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <Row gutter={16} align="top" style={{ height: '100vh', boxSizing: 'border-box', maxHeight: '100vh' }}>
      <Col span={18} push={6}>
        <div className="layout__map-area" ref={mapContainerRef}>
        </div>
      </Col>
      <Col span={6} pull={18}>
        <Space direction="vertical" style={{ padding: '20px 10px' }}>
          <h1 className="layout__title">
            <span>MAP</span>
            <span>STYLE</span>
            <span>CREATER</span>
          </h1>
          <Card className="layout__map-style-creator__card" style={{ maxHeight: '500px', overflowY: 'scroll' }}>
            <MapColorChanger mapStyle={initialMapStyle} onChange={onChangeMapStyle} />
            <Divider />
            <MapLayerColorChanger mapStyle={initialMapStyle} onChange={onChangeMapStyle} />
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<Demo />);
