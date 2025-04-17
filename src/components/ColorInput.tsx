import React from 'react';
import { Input, Form } from 'antd';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
  return (
    <Form.Item
      label={label} // ラベルを表示
      style={{ marginBottom: '16px' }} // スタイル調整
      labelCol={{ span: 6 }} // ラベルの幅を調整
      wrapperCol={{ span: 18 }} // 入力フィールドの幅を調整
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${label}`} // プレースホルダーを設定
      />
    </Form.Item>
  );
};

export default ColorInput;
