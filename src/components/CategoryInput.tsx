import React from 'react';

interface CategoryInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({ value, onChange }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label htmlFor="category" style={{ display: 'block', marginBottom: '8px' }}>カテゴリから選ぶ</label>
      <input
        type="text"
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
    </div>
  );
};

export default CategoryInput;
