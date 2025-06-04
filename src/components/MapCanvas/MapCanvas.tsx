import React, { useRef } from 'react';
import { useAtomValue } from 'jotai';
import { styleAtom } from '../../atom';
import useMapInstance from '../../hooks/useMapInstance';

const MapCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const style = useAtomValue(styleAtom);

  useMapInstance(containerRef, style);

  return <div data-testid="map-container" style={{ width: '100%', height: '100%' }} ref={containerRef} />;
};

export default MapCanvas;
