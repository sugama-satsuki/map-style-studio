import React, { useMemo } from 'react';
import { ColorPickerProps, Flex, GetProp, Input, ColorPicker, Typography } from 'antd';
import { AggregationColor } from 'antd/es/color-picker/color';


export type Color = GetProp<ColorPickerProps, 'value'>;

interface ColorInputProps {
  label: string;
  value: Color | undefined;
  onChange: (value: Color | undefined) => void;
}

const { Text } = Typography;

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {

  const inputValue = useMemo(() => {
    if (!value) { return ''; }
    const { r, g, b, a } = (value as AggregationColor).toRgb();
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }, [value]);

  return (
    <div>
      <Text type="secondary" style={{ margin: 0 }}>{ label }</Text>
      <Flex gap={8}>
        <ColorPicker defaultValue={value} onChangeComplete={(value) => { onChange(value) }} />
        <Input
          value={inputValue}
          placeholder={label}
        />
      </Flex>
    </div>
  );
};

export default ColorInput;
