import React, { useMemo, useState } from 'react';
import { Input, Button, Space, Typography, Card, message, Modal, List } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';
import type { LayerSpecification } from 'maplibre-gl';

type SourcesProps = {
  savePrevStyle: (newStyle: maplibregl.StyleSpecification | undefined) => void;
};

const { TextArea } = Input;
const { Title, Text } = Typography;

const SourceEditor: React.FC<SourcesProps> = ({ savePrevStyle }) => {
  const [style, setStyle] = useAtom(styleAtom);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetSourceId, setTargetSourceId] = useState<string | null>(null);
  const [referencedLayers, setReferencedLayers] = useState<LayerSpecification[]>([]);

  // sourcesを取得
  const sources = useMemo(
    () => style?.sources ?? {},
    [style]
  );

  // ソース削除
  const handleDelete = (sourceId: string) => {
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
    if (!targetSourceId) return;
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
        {
          sources && Object.keys(sources).length > 0 ? (
            Object.keys(sources).map((sourceId, index) => {
              const source = sources[sourceId];
              return (
                <div key={index} style={{ position: 'relative', marginBottom: 16 }}>
                  <Title level={4} style={{ display: 'inline-block', marginRight: 8 }}>{sourceId}</Title>
                  <Button
                    type="dashed"
                    shape="circle"
                    icon={<CloseOutlined />}
                    size="small"
                    danger
                    aria-label={`${sourceId}を削除`}
                    style={{ position: 'absolute', right: 0, top: 0 }}
                    onClick={() => handleDelete(sourceId)}
                  />
                  <TextArea
                    rows={4}
                    value={JSON.stringify(source, null, 2)}
                    readOnly
                    style={{ width: '100%', marginTop: 8 }}
                  />
                </div>
              );
            })
          )
            : (
              <Text type="secondary">sourcesが定義されていません</Text>
            )
        }
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
