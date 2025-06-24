import React, { useEffect, useMemo, useState } from 'react';
import { Input, Button, Space, Typography, Card, message, Modal, List, Flex, Select } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';
import type { LayerSpecification, SourceSpecification } from 'maplibre-gl';
import { fetchSourceLayersFromTileJson } from '../../utils/sourceHelper';

type SourcesProps = {
  savePrevStyle: (newStyle: maplibregl.StyleSpecification | undefined) => void;
};

const { Title, Text } = Typography;

const SOURCE_TYPES = [
  { label: 'vector', value: 'vector' },
  { label: 'raster', value: 'raster' },
  { label: 'geojson', value: 'geojson' },
  { label: 'raster-dem', value: 'raster-dem' },
  { label: 'image', value: 'image' },
  { label: 'video', value: 'video' },
];

const SourceEditor: React.FC<SourcesProps> = ({ savePrevStyle }) => {
  const [style, setStyle] = useAtom(styleAtom);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetSourceId, setTargetSourceId] = useState<string | null>(null);
  const [referencedLayers, setReferencedLayers] = useState<LayerSpecification[]>([]);
  const [editSources, setEditSources] = useState<Record<string, Partial<SourceSpecification & { url?: string, attribution?: string, tiles?: string[], sourceLayers?: string[] }>>>( {});

  // sourcesを取得
  const sources = useMemo(() => (typeof style === 'object' && style?.sources) ?? {}, [style]);

  // 編集用state初期化
  useEffect(() => {
    const initial: Record<string, Partial<SourceSpecification>> = {};
    Object.entries(sources).forEach(([id, src]) => {
      initial[id] = { ...src };
    });
    setEditSources(initial);
  }, [sources]);

  const handleFetchSourceLayers = async (sourceId: string, url?: string) => {
    if (!url) return;
    const layers = await fetchSourceLayersFromTileJson(url);
    console.log(`Fetched source layers for ${sourceId}:`, layers);
    setEditSources(prev => ({
      ...prev,
      [sourceId]: { ...prev[sourceId], sourceLayers: layers }
    }));
  };

  // urlが変更されたらsourceLayersを取得
  useEffect(() => {
    Object.entries(editSources).forEach(([sourceId, src]) => {
      if (src.type === 'vector' && src.url && !src.sourceLayers) {
        handleFetchSourceLayers(sourceId, src.url as string);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSources]);

  // 入力変更
  const handleChange = (sourceId: string, key: string, value: string | string[] | number | undefined) => {
    setEditSources(prev => ({
      ...prev,
      [sourceId]: { ...prev[sourceId], [key]: value }
    }));
  };

  // 保存
  const handleSave = () => {
    try {
      if(!style || typeof style !== 'object') {
        message.error('スタイルが正しく読み込まれていません');
        return;
      }
      const newSources: Record<string, SourceSpecification> = {};
      Object.entries(editSources).forEach(([id, src]) => {
        // type, url, attribution など必要な項目のみ
        const { type, url, attribution, ...rest } = src;
        newSources[id] = {
          ...(type ? { type } : {}),
          ...(url ? { url } : {}),
          ...(attribution ? { attribution } : {}),
          ...rest,
        } as SourceSpecification;
      });
      const newStyle = { ...style!, sources: newSources };
      savePrevStyle(style);
      setStyle(newStyle);
      message.success('sourcesを保存しました');
    } catch {
      message.error('保存に失敗しました');
    }
  };

  // ソース削除
  const handleDelete = (sourceId: string) => {
    if(!style || typeof style !== 'object') {
      message.error('スタイルが正しく読み込まれていません');
      return;
    }
    // 参照しているlayerを検索
    const layers = (style?.layers ?? []).filter(layer => {
      if ('source' in layer) { return layer.source === sourceId; }
      return false;
    });
    if (layers.length > 0) {
      setTargetSourceId(sourceId);
      setReferencedLayers(layers);
      setModalOpen(true);
      return;
    }
    // 参照レイヤーがなければ即削除
    const newSources = { ...sources };
    delete newSources[sourceId];
    const newStyle = { ...style!, sources: newSources };
    savePrevStyle(style);
    setStyle(newStyle);
    message.success(`"${sourceId}" を削除しました`);
  };

  // モーダルで「一緒に削除」選択時
  const handleDeleteWithLayers = () => {
    if (!targetSourceId || !style || typeof style !== 'object') { return; }
    // source削除
    const newSources = { ...sources };
    delete newSources[targetSourceId];
    // 参照レイヤーも削除
    const newLayers = (style?.layers ?? []).filter(layer => !('source' in layer && layer.source === targetSourceId));
    const newStyle = { ...style!, sources: newSources, layers: newLayers };
    savePrevStyle(style);
    setStyle(newStyle);
    message.success(`"${targetSourceId}" と参照レイヤーを削除しました`);
    setModalOpen(false);
    setTargetSourceId(null);
    setReferencedLayers([]);
  };

  // モーダルでキャンセル
  const handleCancelModal = () => {
    setModalOpen(false);
    setTargetSourceId(null);
    setReferencedLayers([]);
  };

  return (
    <Card className='editor-card scroll-y' id='layer-editor' size='small'>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {sources && Object.keys(sources).length > 0 ? (
          Object.keys(sources).map((sourceId, index) => {
            const source = editSources[sourceId] || {};
            return (
              <Space key={index} size="small" direction="vertical" style={{ width: '100%' }}>
                <Flex justify='space-between' align='center' style={{ width: '100%' }}>
                  <Title level={4} className='margin-none'>{sourceId}</Title>
                  <Button
                    type="dashed"
                    shape="circle"
                    icon={<CloseOutlined />}
                    aria-label={`${sourceId}を削除`}
                    onClick={() => handleDelete(sourceId)}
                  />
                </Flex>
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  <div>
                    <label>type</label>
                    <Select
                      style={{ width: 120, marginLeft: 8 }}
                      value={source.type}
                      options={SOURCE_TYPES}
                      onChange={v => handleChange(sourceId, 'type', v)}
                      allowClear
                    />
                  </div>
                  {source.tiles && Array.isArray(source.tiles) && source.tiles.length > 0 ? (
                    <Input
                        addonBefore="tiles"
                        placeholder="tiles（カンマ区切り可）"
                        value={Array.isArray(source.tiles) ? source.tiles.join(',') : ''}
                        onChange={e =>
                        handleChange(
                            sourceId,
                            'tiles',
                            e.target.value
                            ? e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            : undefined
                        )
                        }
                    />
                    ) : (
                    (!source.type || source.type !== 'geojson') && (
                        <Input
                        addonBefore="url"
                        placeholder="url"
                        value={(source as Partial<SourceSpecification & { url?: string }>).url ?? ''}
                        onChange={e => handleChange(sourceId, 'url', e.target.value)}
                        />
                    )
                    )
                  }
                  <Input
                    addonBefore="attribution"
                    placeholder="attribution"
                    value={source.attribution ?? ''}
                    onChange={e => handleChange(sourceId, 'attribution', e.target.value)}
                  />
                  <Input
                    addonBefore="minzoom"
                    placeholder="minzoom"
                    type="number"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value={(source as any).minzoom ?? ''}
                    onChange={e => handleChange(sourceId, 'minzoom', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  <Input
                    addonBefore="maxzoom"
                    placeholder="maxzoom"
                    type="number"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value={(source as any).maxzoom ?? ''}
                    onChange={e => handleChange(sourceId, 'maxzoom', e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                  {/* sourceのsourceLayer一覧をリスト表示 */}
                  <List
                    size="small"
                    bordered
                    dataSource={source.sourceLayers}
                    renderItem={layer => (
                      <List.Item>
                        <span>{layer}</span>
                      </List.Item>
                    )}
                  />
                </Space>
              </Space>
            );
          })
        ) : (
          <Text type="secondary">sourcesが定義されていません</Text>
        )}
        <Button type='primary' onClick={handleSave}>保存</Button>
        <Button type='default' icon={<PlusOutlined />} size='large'>ソースを追加</Button>
      </Space>
      <Modal
        open={modalOpen}
        onOk={handleDeleteWithLayers}
        onCancel={handleCancelModal}
        okText="削除"
        cancelText="キャンセル"
        title="参照レイヤーも削除しますか？"
      >
        <p>
          削除するsourceを参照しているレイヤーがあります。<br />
          下記レイヤーも一緒に削除しますか？
        </p>
        <List
          size="small"
          bordered
          dataSource={referencedLayers}
          renderItem={layer => (
            <List.Item>
              <span>{layer.id}</span>
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
};

export default SourceEditor;
