import React from 'react';
import { Modal, Form, Input, Select, type FormInstance } from 'antd';
import type { LayerSpecification } from 'maplibre-gl';

type AddLayerModalProps = {
  open: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: FormInstance<any>;
  onOk: () => void;
  onCancel: () => void;
  layers: LayerSpecification[];
};

const AddLayerModal: React.FC<AddLayerModalProps> = ({
  open,
  form,
  onOk,
  onCancel,
  layers,
}) => (
  <Modal
    open={open}
    title="新規レイヤーを追加"
    onOk={onOk}
    onCancel={onCancel}
    okText="追加"
    cancelText="キャンセル"
  >
    <Form form={form} layout="vertical">
      <Form.Item
        label="既存レイヤーからコピー"
        name="copyLayerId"
        tooltip="既存レイヤーを選択すると、その内容をコピーして編集できます"
      >
        <Select
          allowClear
          placeholder="コピー元レイヤーを選択"
          onChange={layerId => {
            const layer = layers.find(l => l.id === layerId);
            if (layer) {
              form.setFieldsValue({
                id: `${layer.id}_copy`,
                source: 'source' in layer ? (layer as { source: string }).source : '',
                sourceLayer: (layer as { 'source-layer': string })['source-layer'] ?? '',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                filter: 'filter' in layer && (layer as any).filter ? JSON.stringify((layer as any).filter, null, 2) : '',
                paint: layer.paint ? JSON.stringify(layer.paint, null, 2) : '',
                layout: layer.layout ? JSON.stringify(layer.layout, null, 2) : '',
              });
            }
          }}
        >
          {layers && layers.map(layer => (
            <Select.Option key={layer.id} value={layer.id}>
              {layer.id}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="レイヤーID"
        name="id"
        rules={[{ required: true, message: 'レイヤーIDを入力してください' }]}
        tooltip="このレイヤーを識別するための名前です（例: my-road-layer）"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="ソース (source)"
        name="source"
        rules={[{ required: true, message: 'sourceを入力してください' }]}
        tooltip="データの供給元のIDです。「ソース」タブで追加したソースのIDを指定します（例: geolonia-tiles）"
      >
        <Input placeholder="例: geolonia-tiles" />
      </Form.Item>
      <Form.Item
        label="ソースレイヤー (source-layer)"
        name="sourceLayer"
        tooltip="ベクタータイル内の特定のデータ層の名前です。vectorタイプのソースで必要です（例: building, road, water）"
      >
        <Input placeholder="例: building" />
      </Form.Item>
      <Form.Item
        label="フィルター (filter)"
        name="filter"
        tooltip='表示するデータを絞り込む条件をJSON形式で指定します。例: ["==", "class", "motorway"] は class が motorway のものだけ表示します'
      >
        <Input.TextArea rows={2} placeholder='["==", "class", "motorway"]' />
      </Form.Item>
      <Form.Item
        label="ペイント (paint)"
        name="paint"
        tooltip='色・透明度・太さなど見た目のプロパティをJSON形式で指定します。例: {"fill-color": "#ff0000", "fill-opacity": 0.8}'
      >
        <Input.TextArea rows={2} placeholder='{"fill-color": "#ff0000"}' />
      </Form.Item>
      <Form.Item
        label="レイアウト (layout)"
        name="layout"
        tooltip='テキストの向きやアイコンの配置ルールをJSON形式で指定します。例: {"text-field": "{name}", "text-size": 12}'
      >
        <Input.TextArea rows={2} placeholder='{"text-field": "{name}"}' />
      </Form.Item>
    </Form>
  </Modal>
);

export default AddLayerModal;
