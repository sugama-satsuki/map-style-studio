import { useEffect, useState, useCallback } from 'react';
import '@ant-design/v5-patch-for-react-19';
import CategorySelect from './CategorySelect';
import ColorInput from './ColorInput';
import { Card, Slider, Space } from 'antd';
import './MapStyleCreator.css';
import { StyleSpecification } from 'maplibre-gl';
import useUpdateMapStyle from '../hooks/useUpdateMapStyle';

type MapStyleCreatorProps = {
  mapStyle: StyleSpecification | undefined;
  onChange: (mapStyle: StyleSpecification | undefined) => void;
};

const MapStyleCreator: React.FC<MapStyleCreatorProps> = (props) => {
  const { mapStyle, onChange } = props;

  const [category, setCategory] = useState('');
  const [colors, setColors] = useState({
    primary: '',
    secondary: '',
  });
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const updatedStyle = useUpdateMapStyle(mapStyle, colors);

  /* **************** 
   * 色の変更
   * ****************/ 
  const handleColorChange = (key: string, value: string) => {
    setColors((prevColors) => ({
      ...prevColors,
      [key]: value,
    }));
  };

  /* **************** 
   * スタイルを適用
   * ****************/ 
  const handleSubmit = useCallback(() => {
    onChange(updatedStyle);
  }, [onChange, updatedStyle]);

  
  useEffect(() => {
    handleSubmit();
  }, [category, colors, handleSubmit]);

  return (
    <>
      <Card className="map-style-creator-card">
        <Space direction="vertical" size="large" className="flex">
          <Space direction="vertical" size="small" className="flex">
            <div>
              <label>テーマから選ぶ</label>
              <CategorySelect value={category} onChange={setCategory} />
            </div>
            <div>
              <label>自分で色を設定する</label>
              <Space direction="vertical" size="small" className="flex">
                {['primary', 'secondary'].map((color) => (
                  <ColorInput
                    key={color}
                    label={color}
                    value={colors[color as keyof typeof colors]}
                    onChange={(value) => handleColorChange(color, value)}
                  />
                ))}
              </Space>
            </div>
            <Space direction="vertical" size="large" className="flex">
              <div>
                <label>明度</label>
                <Slider
                  min={0}
                  max={200}
                  value={brightness}
                  onChange={(value: number) => setBrightness(value)}
                  tooltip={{ formatter: (value) => `${value}%` }}
                />
              </div>
              <div>
                <label>彩度</label>
                <Slider
                  min={0}
                  max={200}
                  value={saturation}
                  onChange={(value: number) => setSaturation(value)}
                  tooltip={{ formatter: (value) => `${value}%` }}
                />
              </div>
            </Space>
          </Space>
        </Space>
      </Card>
    </>
  );
};

export default MapStyleCreator;
