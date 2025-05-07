import React, { useEffect, useRef, useState } from 'react';
import { MapStyleCreator } from '../../src';
import { createRoot } from 'react-dom/client';
import maplibregl, { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styleJson from './style.json';


const Demo = () => {

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [mapStyle, setMapStyle] = useState<StyleSpecification | undefined>(undefined);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  const onChangeMapStyle = (newMapStyle: StyleSpecification | undefined) => {
    console.log('newMapStyle!!!!: ', newMapStyle);
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
    <div className="layout">
      <div className="layout__map-area" ref={mapContainerRef}>
      </div>
      <div className="layout__form-area">
        <h1 className="layout__title">
            <span>MAP</span>
            <span>STYLE</span>
            <span>CREATER</span>
        </h1>
        <MapStyleCreator mapStyle={mapStyle} onChange={onChangeMapStyle} />
      </div>
    </div>
  );
};

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<Demo />);
