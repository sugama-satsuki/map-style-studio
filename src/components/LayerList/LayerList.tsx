import React from 'react';
import { Input, Button, List, Typography, Space, Collapse } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { styleAtom } from '../../atom';
import { groupLayersByType } from '../../utils/layerControl';
import type { LayerSpecification } from 'maplibre-gl';

const { Text } = Typography;
const { Panel } = Collapse;

const LayerList: React.FC = () => {
    const style = useAtomValue(styleAtom);
    const layers = style?.layers || [];
    const grouped = groupLayersByType(layers);

    const layerGroups = [
        { type: 'point', label: 'point', layers: grouped.point },
        { type: 'symbol', label: 'symbol', layers: grouped.symbol },
        { type: 'line', label: 'line', layers: grouped.line },
        { type: 'polygon', label: 'polygon', layers: grouped.polygon },
    ];

    // レイヤーの詳細情報をアコーディオンで表示
    const renderLayerDetail = (layer: LayerSpecification) => {
        console.log('renderLayerDetail', layer);
        return (
            <Collapse ghost size="small">
                <Panel header="Filter" key="filter">
                    {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify((layer as any).filter, null, 2)}</pre>
                    }
                </Panel>
                <Panel header="Paint" key="paint">
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(layer.paint, null, 2)}</pre>
                </Panel>
                <Panel header="Layout" key="layout">
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(layer.layout, null, 2)}</pre>
                </Panel>
            </Collapse>
        );
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ padding: 16, paddingBottom: 0 }}>
                <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 8 }} />
                <Input placeholder="Search layers" style={{ marginBottom: 16 }} />
            </div>
            <Collapse
                defaultActiveKey={layerGroups.map(g => g.type)}
                ghost
            >
                {layerGroups.map(group => (
                    <Panel header={<Text strong>{group.label}</Text>} key={group.type}>
                        <List
                            size="small"
                            dataSource={group.layers}
                            renderItem={item => (
                                <List.Item>
                                    <div style={{ width: '100%' }}>
                                        <Text>{item.id}</Text>
                                        {renderLayerDetail(item)}
                                    </div>
                                </List.Item>
                            )}
                            locale={{ emptyText: null }}
                        />
                    </Panel>
                ))}
            </Collapse>
        </Space>
    );
};

export default LayerList;