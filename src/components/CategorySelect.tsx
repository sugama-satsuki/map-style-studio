import React from 'react';
import { Select, Form } from 'antd';

const { Option } = Select;

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  return (
    <Form.Item
      label="カテゴリから選ぶ" // Ant Designのラベル
      style={{ marginBottom: '16px' }}
    >
      <Select
        value={value}
        onChange={onChange}
        placeholder="カテゴリを選択してください"
        style={{ width: '100%' }}
      >
        {/* 選択肢を追加 */}
        <Option value="category1">カテゴリ1</Option>
        <Option value="category2">カテゴリ2</Option>
        <Option value="category3">カテゴリ3</Option>
      </Select>
    </Form.Item>
  );
};

export default CategorySelect;
