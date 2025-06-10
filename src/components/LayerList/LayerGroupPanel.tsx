import React from 'react';
import { Collapse, Flex, Tooltip, Button, Typography, List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LayerListItem from './LayerListItem';
import type { LayerSpecification } from 'maplibre-gl';

const { Panel } = Collapse;
const { Text } = Typography;

type Props = {
    layerGroups: {
        type: string;
        label: string;
        layers: LayerSpecification[];
    }[];
    group: {
        type: string;
        label: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layers: any[];
    };
    editing: { layerId: string; field: 'filter' | 'paint' | 'layout' | null; value: string } | null;
    onEdit: (layerId: string, field: 'filter' | 'paint' | 'layout') => void;
    onDeleteStyle: (field: 'filter' | 'paint' | 'layout') => void;
    onDeleteLayer: (layerId: string) => void;
    onSave: (layerId: string, field: 'filter' | 'paint' | 'layout', value: string) => void;
    onCancel: () => void;
};

const LayerGroupPanel: React.FC<Props> = ({ layerGroups, group, editing, onEdit, onDeleteStyle, onDeleteLayer, onSave, onCancel }) => {

    return (

        <Collapse defaultActiveKey={layerGroups.map(g => g.type)} style={{ width: '100%', padding: 0 }}>
            <Panel
                header={
                    <Flex justify="space-between" align="center" gap={4}>
                        <Text strong>{group.label}</Text>
                        <Flex justify="right" align="center" gap={4}>
                            <Text strong>{`${group.layers.length}件`}</Text>
                            <Tooltip title="レイヤーを追加">
                                <Button type="primary" icon={<PlusOutlined />} />
                            </Tooltip>
                        </Flex>
                    </Flex>
                }
                key={group.type}
            >
                <List
                    style={{ width: '100%', padding: 0 }}
                    size="small"
                    dataSource={group.layers}
                    renderItem={item => (
                        <List.Item style={{ width: '100%', padding: 0 }}>
                            <LayerListItem
                                layer={item}
                                editing={editing}
                                onEdit={field => onEdit(item.id, field)}
                                onDeleteStyle={field => onDeleteStyle(field)}
                                onDeleteLayer={() => onDeleteLayer(item.id)}
                                onSave={(field, value) => onSave(item.id, field, value)}
                                onCancel={onCancel}
                            />
                        </List.Item>
                    )}
                    locale={{ emptyText: null }}
                />
            </Panel>
        </Collapse>
    );
};

export default LayerGroupPanel;
