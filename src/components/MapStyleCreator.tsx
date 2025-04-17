import React, { useState } from 'react';
import CategorySelect from './CategorySelect';
import ColorInput from './ColorInput';
import { Button } from 'antd';
import './MapStyleCreator.css';

const MapStyleCreator = () => {
  const [category, setCategory] = useState('');
  const [colors, setColors] = useState({
    color1: '',
    color2: '',
    color3: '',
  });

  const handleColorChange = (key: string, value: string) => {
    setColors((prevColors) => ({
      ...prevColors,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Selected Category:', category);
    console.log('Selected Colors:', colors);
    // 適用処理をここに追加
  };

  return (
    <form onSubmit={handleSubmit} className="map-style-creator-form">
      <CategorySelect value={category} onChange={setCategory} />
      <div style={{ marginBottom: '16px' }}>
        <p style={{ marginBottom: '8px' }}>自分で色を設定する</p>
        {['color1', 'color2', 'color3'].map((color) => (
          <ColorInput
            key={color}
            label={color}
            value={colors[color as keyof typeof colors]}
            onChange={(value) => handleColorChange(color, value)}
          />
        ))}
      </div>
      <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
        適用する
      </Button>
      <Button type="default" htmlType="submit" style={{ width: '100%', marginTop: '8px' }}>
        styleを書き出す
      </Button>
    </form>
  );
};

export default MapStyleCreator;
