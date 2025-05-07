import React from 'react';
import { Flex, Input, ColorPicker } from 'antd';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
  return (
    <Flex gap={8}>
      <ColorPicker defaultValue={value} onChange={(value, css) => { onChange(css) }} />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${label}を入力`}
      />
    </Flex>
  );
};

export default ColorInput;
