import React, { useEffect, useRef, useState } from 'react';
import { MapColorChanger, MapLayerColorChanger } from '../../src';
import { createRoot } from 'react-dom/client';
import maplibregl, { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styleJson from './style.json';
import { Card, Checkbox, Col, Divider, Input, Row, Space } from 'antd';


const Demo = () => {

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [initialMapStyle, setMapStyle] = useState<StyleSpecification | undefined>(undefined);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [zoom, setZoom] = useState<number>(0);
  const [checked, setChecked] = useState<boolean>(false);

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
      zoom: 10,
      hash: true
    });

    map.on('load', () => {
      setMap(map);
      setZoom(map.getZoom());
      setMapStyle(map.getStyle());
    });

    map.on('zoomend', () => {
      const zoom = map.getZoom();
      setZoom(zoom);
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <Row align="top" style={{ height: '100vh', boxSizing: 'border-box', maxHeight: '100vh' }}>
      <Col span={8} push={16}>
        <Space direction="vertical" style={{ padding: '20px 10px' }}>
            <h1 className="layout__title">
              <span>MAP</span>
              <span>STYLE</span>
              <span>CREATER</span>
            </h1>
            <Input value={ `zoomレベル：${ zoom }` } />
            <Checkbox value="road" checked={checked} onChange={() => setChecked(prev => !prev)}>zoomレベル毎に色を設定</Checkbox> 
            <Card className="layout__map-style-creator__card" style={{ maxHeight: '500px', overflowY: 'scroll' }}>
              <MapColorChanger mapStyle={initialMapStyle} onChange={onChangeMapStyle} />
              <Divider />
              <MapLayerColorChanger 
                mapStyle={initialMapStyle} 
                onChange={onChangeMapStyle} 
                options={{
                  minzoom: checked ? zoom : undefined
                }}
              />
            </Card>
          </Space>
      </Col>
      <Col span={16} pull={8}>
        <div className="layout__map-area" ref={mapContainerRef}>
        </div>
      </Col>
    </Row>
  );
};

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<Demo />);
