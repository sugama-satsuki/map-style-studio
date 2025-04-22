import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="テーマを選択してください"
      style={{ width: '100%' }}
    >
      {/* 選択肢を追加 */}
      <Option value="category1">テーマ1</Option>
      <Option value="category2">テーマ2</Option>
      <Option value="category3">テーマ3</Option>
    </Select>
  );
};

export default CategorySelect;
