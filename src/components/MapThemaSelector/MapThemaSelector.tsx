import React from 'react';
import { Select, Space } from 'antd';

type MapThemaSelectorProps = {
  category: string;
  onCategoryChange: (value: string) => void;
};

const { Option } = Select;

const MapThemaSelector: React.FC<MapThemaSelectorProps> = ({ category, onCategoryChange }) => {
  return (
    <Space direction="vertical">
      <label>テーマから選ぶ</label>
      <Select
        value={category}
        onChange={onCategoryChange}
        placeholder="テーマを選択してください"
        style={{ width: '100%' }}
      >
        {/* 選択肢を追加 */}
        <Option value="category1">テーマ1</Option>
        <Option value="category2">テーマ2</Option>
        <Option value="category3">テーマ3</Option>
      </Select>
    </Space>
  );
};

export default MapThemaSelector;
