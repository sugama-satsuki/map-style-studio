import React, { useState, useEffect } from 'react';
import ColorInput from '../internal/ColorInput';
import { StyleSpecification } from 'maplibre-gl';
import useUpdateMapStyle from '../../hooks/useUpdateMapStyle';
import { ColorPickerProps, GetProp } from 'antd';

type MapColorChangerProps = {
  mapStyle: StyleSpecification | undefined;
  onChange: (updatedStyle: StyleSpecification | undefined) => void;
  label?: string;
};

export type Color = GetProp<ColorPickerProps, 'value'>;

const MapColorChanger: React.FC<MapColorChangerProps> = ({ mapStyle, onChange, label }) => {
  const [primaryColor, setPrimaryColor] = useState<Color | undefined>(undefined);

  const { updatedStyle } = useUpdateMapStyle(mapStyle, primaryColor);

  useEffect(() => {
    if (updatedStyle) {
      onChange(updatedStyle);
    }
  }, [updatedStyle, onChange]);

  return (
    <div>
      <ColorInput
        label={label??"テーマカラー"}
        value={primaryColor}
        onChange={(value) => setPrimaryColor(value)}
      />
    </div>
  );
};

export default MapColorChanger;
