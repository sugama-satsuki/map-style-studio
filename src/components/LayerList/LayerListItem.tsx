import React from 'react';
import { Flex, Tooltip, Button, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import type { LayerSpecification } from 'maplibre-gl';
import LayerDetailAccordion from './LayerDetailAccordion';
import { useLayerVisibility } from '../../hooks/useLayerVisibility';
import { useAtomValue } from 'jotai';
import { mapRefAtom } from '../../atom';

const { Text } = Typography;

type Props = {
  layer: LayerSpecification;
  editing: { layerId: string; field: 'filter' | 'paint' | 'layout' | null; value: string } | null;
  onEdit: (field: 'filter' | 'paint' | 'layout') => void;
  onDeleteStyle: (field: 'filter' | 'paint' | 'layout') => void;
  onDeleteLayer: (layerId: string) => void;
  onSave: (field: 'filter' | 'paint' | 'layout', value: string) => void;
  onCancel: () => void;
};

const LayerListItem: React.FC<Props> = ({ layer, editing, onEdit, onDeleteStyle, onDeleteLayer, onSave, onCancel }) => {
    const mapRef = useAtomValue(mapRefAtom);
    const { isVisible, toggleVisibility } = useLayerVisibility(mapRef, layer.id);

  return (<div style={{ width: '100%', padding: 0 }}>
    <Flex justify="space-between" align="center" gap={4}>
      <Text>{layer.id}</Text>
      <Flex justify="right" align="center" gap={2}>
        <Tooltip title={isVisible ? '非表示' : '表示'}>
          <Button 
            type="default" 
            shape="circle" 
            icon={ isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />} 
            onClick={toggleVisibility}
          />
        </Tooltip>
        <Tooltip title="削除">
          <Button 
            type="default" 
            shape="circle" 
            icon={<DeleteOutlined />} 
            onClick={() => onDeleteLayer(layer.id)}
          />
        </Tooltip>
      </Flex>
    </Flex>
    <LayerDetailAccordion
      layer={layer}
      editing={editing}
      onEdit={onEdit}
      onDeleteStyle={onDeleteStyle}
      onSave={onSave}
      onCancel={onCancel}
    />
  </div>)
};

export default LayerListItem;
