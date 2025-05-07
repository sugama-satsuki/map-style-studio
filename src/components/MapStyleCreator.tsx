import { useEffect, useState } from 'react';
import '@ant-design/v5-patch-for-react-19';
import CategorySelect from './CategorySelect';
import ColorInput, { Color } from './ColorInput';
import { Card, Checkbox, Flex, Space } from 'antd';
import './MapStyleCreator.css';
import { StyleSpecification } from 'maplibre-gl';
import useUpdateMapStyle from '../hooks/useUpdateMapStyle';
import { AggregationColor } from 'antd/es/color-picker/color';

type MapStyleCreatorProps = {
  initialMapStyle: StyleSpecification | undefined;
  onChange: (initial: StyleSpecification | undefined) => void;
};

const MapStyleCreator: React.FC<MapStyleCreatorProps> = (props) => {
  const { initialMapStyle, onChange } = props;

  const [category, setCategory] = useState('');
  const [primaryColor, setprimaryColor] = useState<Color | undefined>(undefined);
  const [layerColors, setLayerColors] = useState<{ [key: string]: AggregationColor | undefined } | undefined>(undefined);
  const [showLayerColors, setShowLayerColors] = useState(false);
  const [mapStyle, setMapStyle] = useState<StyleSpecification | undefined>(initialMapStyle);

  const { updatedStyle } = useUpdateMapStyle(mapStyle, primaryColor, layerColors);

  useEffect(() => {
    if (initialMapStyle) {
      setMapStyle(initialMapStyle);
    }
  }
  , [updatedStyle, initialMapStyle]);

  /* **************** 
   * 色の変更
   * ****************/ 
  const handleColorChange = (value: Color | undefined) => {
    setprimaryColor(value);
  };

  /* **************** 
   * スタイルを適用
   * ****************/ 
  useEffect(() => {
    if (updatedStyle) { onChange(updatedStyle); }
  }, [updatedStyle, onChange]);


  return (
    <>
      <Card className="map-style-creator-card">
        <Space direction="vertical" size="large" className="flex">
          <Flex vertical gap={8}>
            <div>
              <label>テーマから選ぶ</label>
              <CategorySelect value={category} onChange={setCategory} />
            </div>
            <div>
              <label>自分で色を設定する</label>
              <ColorInput
                label={"テーマカラー"}
                value={primaryColor}
                onChange={(value) => handleColorChange(value)}
              />
            </div>
            <Space direction="vertical" size="small">
              <Checkbox onChange={() => setShowLayerColors((prev) => !prev)}>レイヤーごとに色をかえる</Checkbox>
              { showLayerColors &&
                <Flex vertical gap={4}>
                  { (updatedStyle??initialMapStyle)?.layers.map((layer) => {
                    return <ColorInput
                      key={layer.id}
                      label={layer.id}
                      value={layerColors ? layerColors[layer.id] || '' : ''}
                      onChange={(value) => setLayerColors((prev) => ({
                          ...prev,
                          [layer.id]: value as AggregationColor
                        }))
                      }
                    />
                  }) 
                  }
                </Flex>
              }
            </Space>
          </Flex>
        </Space>
      </Card>
    </>
  );
};

export default MapStyleCreator;
