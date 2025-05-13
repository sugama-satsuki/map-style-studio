import React, { useEffect, useState } from 'react';
import { Flex } from 'antd';
import ColorInput from '../internal/ColorInput';
import { AggregationColor } from 'antd/es/color-picker/color';
import useUpdateLayerStyle from '../../hooks/useUpdateLayerStyle';
import { MapLayerColorChangerProps } from './types';


const MapLayerColorChanger: React.FC<MapLayerColorChangerProps> = ({ mapStyle, onChange, options }) => {

  const [layerColors, setLayerColors] = useState<{ [key: string]: AggregationColor | undefined }>({});

  const { updatedStyle } = useUpdateLayerStyle(mapStyle, layerColors, options);


  useEffect(() => {
    if(!updatedStyle) { return; }
    onChange(updatedStyle);
  }, [onChange, updatedStyle]);


  const handleLayerColorChange = (layerId: string, value: AggregationColor | undefined) => {
    setLayerColors({
      ...layerColors,
      [layerId]: value,
    });
  };


  return (
    <Flex vertical gap={4}>
        {(mapStyle?.layers || []).map((layer) => (
        <ColorInput
            key={layer.id}
            label={layer.id}
            value={layerColors[layer.id]}
            onChange={(value) => handleLayerColorChange(layer.id, value as AggregationColor)}
        />
        ))}
    </Flex>
  );
};

export default MapLayerColorChanger;
