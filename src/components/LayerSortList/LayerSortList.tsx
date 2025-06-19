import React, { useState } from 'react';
import { Button, List, Space, Typography, message } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';
import type { StyleSpecification, LayerSpecification } from 'maplibre-gl';

const { Text } = Typography;

interface Props {
  savePrevStyle: (newStyle: StyleSpecification | undefined) => void;
}

const LayerSortList: React.FC<Props> = ({ savePrevStyle }) => {
  const [style, setStyle] = useAtom(styleAtom);
  const [layers, setLayers] = useState<LayerSpecification[]>(() => (typeof style !== 'object' ? [] : [...style.layers]));

  // style.layersが変わったらstateも更新
  React.useEffect(() => {
    setLayers((typeof style === 'object' && style.layers) ? [...style.layers] : []);
  }, [style]);

  const moveLayer = (from: number, to: number) => {
    if (to < 0 || to >= layers.length) return;
    const newLayers = [...layers];
    const [removed] = newLayers.splice(from, 1);
    newLayers.splice(to, 0, removed);
    setLayers(newLayers);
  };

  const handleSave = () => {
    if (!style || typeof style !== 'object') { return; }
    savePrevStyle(style);
    setStyle({ ...style, layers });
    message.success('レイヤーの順序を保存しました');
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <List
        bordered
        size="small"
        dataSource={layers}
        renderItem={(layer, idx) => (
          <List.Item
            actions={[
              <Button
                icon={<UpOutlined />}
                size="small"
                disabled={idx === 0}
                onClick={() => moveLayer(idx, idx - 1)}
                aria-label="上へ"
              />,
              <Button
                icon={<DownOutlined />}
                size="small"
                disabled={idx === layers.length - 1}
                onClick={() => moveLayer(idx, idx + 1)}
                aria-label="下へ"
              />
            ]}
          >
            <Text>{layer.id}</Text>
          </List.Item>
        )}
      />
      <Button type="primary" onClick={handleSave} disabled={!style}>
        並び順を保存
      </Button>
    </Space>
  );
};

export default LayerSortList;
