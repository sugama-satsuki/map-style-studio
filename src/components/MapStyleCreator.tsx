import { useState } from 'react';
import '@ant-design/v5-patch-for-react-19';
import CategorySelect from './CategorySelect';
import ColorInput from './ColorInput';
import { Button, Card, Space } from 'antd';
import './MapStyleCreator.css';
import { StyleSpecification } from 'maplibre-gl';
import useUpdateMapStyle from '../hooks/useUpdateMapStyle';
import MapStylePreview from './MapStylePreview';

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

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

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
  const handleSubmit = () => {
    onChange(updatedStyle);
  };

  /* **************** 
   * styleのプレビューを表示
   * ****************/ 
  const handlePreviewStyle = () => {
    setIsPreviewVisible(true);
  };

  const handleClosePreview = () => {
    setIsPreviewVisible(false);
  };

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
          </Space>
          <Space direction="vertical" size="small" className="flex">
            <Button type="default" onClick={handlePreviewStyle} className="full-width">
              プレビュー
            </Button>
            <Button type="primary" onClick={handleSubmit} className="full-width">
              適用する
            </Button>
          </Space>
        </Space>
      </Card>
      <MapStylePreview
        visible={isPreviewVisible}
        onClose={handleClosePreview}
        style={updatedStyle}
      />
    </>
  );
};

export default MapStyleCreator;
