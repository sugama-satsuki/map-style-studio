import { useState } from 'react';
import CategorySelect from './CategorySelect';
import ColorInput from './ColorInput';
import { Button, Form } from 'antd';
import './MapStyleCreator.css';
import { StyleSpecification } from 'maplibre-gl';
import useUpdateMapStyle from '../hooks/useUpdateMapStyle';

const MapStyleCreator = (mapStyle: StyleSpecification | undefined) => {
  const [category, setCategory] = useState('');
  const [colors, setColors] = useState({
    primary: '',
    secondary: '',
    other: '',
  });

  const updatedStyle = useUpdateMapStyle(mapStyle, colors);

  const handleColorChange = (key: string, value: string) => {
    setColors((prevColors) => ({
      ...prevColors,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Selected Category:', category);
    console.log('Selected Colors:', colors);
    console.log('Updated Style:', updatedStyle);
    // 適用処理をここに追加
  };

  const handleExportStyle = () => {
    console.log('Exported Style:', updatedStyle);
    // JSONファイルとして書き出す処理を追加
    const blob = new Blob([JSON.stringify(updatedStyle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'style.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit} className="map-style-creator-form">
      <Form.Item label="カテゴリから選ぶ" name="category">
        <CategorySelect value={category} onChange={setCategory} />
      </Form.Item>
      <Form.Item label="自分で色を設定する">
        {['color1', 'color2', 'color3'].map((color) => (
          <ColorInput
            key={color}
            label={color}
            value={colors[color as keyof typeof colors]}
            onChange={(value) => handleColorChange(color, value)}
          />
        ))}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className='full-width'>
          適用する
        </Button>
      </Form.Item>
      <Form.Item>
        <Button type="default" onClick={handleExportStyle} className='full-width margin-top-small'>
          styleを書き出す
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MapStyleCreator;
