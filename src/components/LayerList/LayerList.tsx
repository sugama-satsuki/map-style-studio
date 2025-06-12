import React, { useMemo, useState } from 'react';
import { Input, Space } from 'antd';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';
import { groupLayersByType } from '../../utils/layerControl';
import LayerGroupPanel from './LayerGroupPanel';

const LayerList: React.FC = () => {
    const [style, setStyle] = useAtom(styleAtom);
    const layers = style?.layers ?? [];
    const grouped = groupLayersByType(layers);

    const layerGroups = useMemo(() => [
        { type: 'circle', label: 'circle', layers: grouped.point },
        { type: 'symbol', label: 'symbol', layers: grouped.symbol },
        { type: 'line', label: 'line', layers: grouped.line },
        { type: 'fill', label: 'fill', layers: grouped.fill },
        { type: 'other', label: 'other', layers: grouped.other },
    ], [grouped]);

    const [editing, setEditing] = useState<{
        layerId: string;
        field: 'filter' | 'paint' | 'layout' | null;
        value: string;
    } | null>(null);

    const [search, setSearch] = useState('');

    // 検索ワードでフィルタリング
    const filteredGroups = useMemo(() => (
        search === '' ? layerGroups :
        layerGroups.map(group => ({
            ...group,
            layers: group.layers.filter(layer =>
                layer.id.toLowerCase().includes(search.toLowerCase())
            ),
        })).filter(group => group.layers.length > 0)
    ), [layerGroups, search]);

    // 編集開始
    const handleEdit = (layerId: string, field: 'filter' | 'paint' | 'layout') => {
        setEditing({ layerId, field, value: '' });
    };

    // 編集保存
    const handleSave = (layerId: string, field: 'filter' | 'paint' | 'layout', value: string) => {
        try {
            const newValue = value ? JSON.parse(value) : undefined;
            const newLayers = layers.map(l =>
                l.id === layerId ? { ...l, [field]: newValue } : l
            );
            setStyle({ ...style!, layers: newLayers });
            setEditing(null);
        } catch {
            // エラー処理
        }
    };

    // リセット処理（filter/paint/layoutをundefinedにする）
    const handleResetStyle = (layerId: string, field: 'filter' | 'paint' | 'layout') => {
        const newLayers = layers.map(l =>
            l.id === layerId
                ? {
                    ...l,
                    [field]:
                        field === 'filter' ? [] :
                        field === 'paint' || field === 'layout' ? {} :
                        undefined
                }
                : l
        );
        setStyle({ ...style!, layers: newLayers });
    };
    // レイヤー削除処理
    const handleDeleteLayer = (layerId: string) => {
        const newLayers = layers.filter(l => l.id !== layerId);
        setStyle({ ...style!, layers: newLayers });
    };

    // 編集キャンセル
    const handleCancel = () => setEditing(null);

    return (
        <Space direction="vertical" style={{ width: '100%', padding: 0 }} size='small'>
            <Input
                size="large"
                placeholder="レイヤー検索"
                value={search}
                onChange={e => setSearch(e.target.value)}
                allowClear
            />
            {filteredGroups.map(group => (
                <LayerGroupPanel
                    key={group.type}
                    layerGroups={layerGroups}
                    group={group}
                    editing={editing}
                    onEdit={handleEdit}
                    onResetStyle={(field) => handleResetStyle(group.layers[0].id, field)}
                    onDeleteLayer={() => handleDeleteLayer(group.layers[0].id)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ))}
        </Space>
    );
};

export default LayerList;
