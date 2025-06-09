import React, { useState } from 'react';
import { Input, Button, List, Typography, Space, Collapse, Flex, Tooltip, message } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';
import { groupLayersByType } from '../../utils/layerControl';
import type { LayerSpecification } from 'maplibre-gl';

// TODO：編集の挙動が遅い
const { Text } = Typography;
const { Panel } = Collapse;

const LayerList: React.FC = () => {
    const [style, setStyle] = useAtom(styleAtom);
    const layers = style?.layers || [];
    const grouped = groupLayersByType(layers);

    const layerGroups = [
        { type: 'point', label: 'point', layers: grouped.point },
        { type: 'symbol', label: 'symbol', layers: grouped.symbol },
        { type: 'line', label: 'line', layers: grouped.line },
        { type: 'polygon', label: 'polygon', layers: grouped.polygon },
    ];

    // 編集状態
    const [editing, setEditing] = useState<{
        layerId: string;
        field: 'filter' | 'paint' | 'layout' | null;
        value: string;
    } | null>(null);

    // 編集開始
    const handleEdit = (layer: LayerSpecification, field: 'filter' | 'paint' | 'layout') => {
        setEditing({
            layerId: layer.id,
            field,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value: JSON.stringify((layer as any)[field], null, 2) || ''
        });
    };

    // 編集保存
    const handleSave = (layer: LayerSpecification, field: 'filter' | 'paint' | 'layout') => {
        try {
            const newValue = editing ? JSON.parse(editing.value) : undefined;
            const newLayers = layers.map(l =>
                l.id === layer.id ? { ...l, [field]: newValue } : l
            );
            setStyle({ ...style!, layers: newLayers });
            setEditing(null);
            message.success('保存しました');
        } catch {
            message.error('JSONの構文が正しくありません');
        }
    };

    // 編集キャンセル
    const handleCancel = () => setEditing(null);

    // レイヤーの詳細情報をアコーディオンで表示
    const renderLayerDetail = (layer: LayerSpecification) => {
        return (
            <Collapse ghost size="small" style={{ width: '100%', padding: 0 }}>
                {(['filter', 'paint', 'layout'] as const).map(field => (
                    <Panel
                        header={
                            <Flex justify="space-between" align="center">
                                <Text strong>{field}</Text>
                                <Flex justify="right" align="center" gap={2}>
                                    {editing?.layerId === layer.id && editing?.field === field ? (
                                        <>
                                            <Tooltip title="保存">
                                                <Button
                                                    type="primary"
                                                    shape="circle"
                                                    icon={<CheckOutlined />}
                                                    onClick={() => handleSave(layer, field)}
                                                />
                                            </Tooltip>
                                            <Tooltip title="キャンセル">
                                                <Button
                                                    type="default"
                                                    shape="circle"
                                                    icon={<CloseOutlined />}
                                                    onClick={handleCancel}
                                                />
                                            </Tooltip>
                                        </>
                                    ) : (
                                        <Tooltip title="編集">
                                            <Button
                                                type="default"
                                                shape="circle"
                                                icon={<EditOutlined />}
                                                onClick={() => handleEdit(layer, field)}
                                            />
                                        </Tooltip>
                                    )}
                                    <Tooltip title="削除">
                                        <Button type="default" shape="circle" icon={<DeleteOutlined />} />
                                    </Tooltip>
                                </Flex>
                            </Flex>
                        }
                        key={field}
                        style={{ width: '100%', padding: 0 }}
                    >
                        {editing?.layerId === layer.id && editing?.field === field ? (
                            <Input.TextArea
                                value={editing.value}
                                onChange={e => setEditing({ ...editing, value: e.target.value })}
                                autoSize={{ minRows: 4 }}
                            />
                        ) : (
                            <pre style={{ whiteSpace: 'pre-wrap' }}>
                                {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    JSON.stringify((layer as any)[field], null, 2)
                                }
                            </pre>
                        )}
                    </Panel>
                ))}
            </Collapse>
        );
    };

    return (
        <Space direction="vertical" style={{ width: '100%', padding: 0 }}>
            <div style={{ padding: 16, paddingBottom: 0 }}>
                <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 8 }} />
                <Input placeholder="Search layers" style={{ marginBottom: 16 }} />
            </div>
            <Collapse
                defaultActiveKey={layerGroups.map(g => g.type)}
                ghost
            >
                {layerGroups.map(group => (
                    <Panel
                        header={<Text strong>{group.label}</Text>}
                        key={group.type}
                    >
                        <List
                            style={{ width: '100%', padding: 0 }}
                            size="small"
                            dataSource={group.layers}
                            renderItem={item => (
                                <List.Item style={{ width: '100%', padding: 0 }}>
                                    <div style={{ width: '100%', padding: 0 }}>
                                        <Flex justify="space-between" align="center" gap={8}>
                                            <Text>{item.id}</Text>
                                            <Flex justify="right" align="center" gap={4}>
                                                <Tooltip title={'表示'}>
                                                    <Button type="default" shape="circle" icon={<EyeOutlined />} />
                                                </Tooltip>
                                                <Tooltip title="削除">
                                                    <Button type="default" shape="circle" icon={<DeleteOutlined />} />
                                                </Tooltip>
                                            </Flex>
                                        </Flex>
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
