import React from 'react';
import { Modal, Form, Input, type FormInstance } from 'antd';

type AddLayerModalProps = {
  open: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: FormInstance<any>;
  onOk: () => void;
  onCancel: () => void;
};

const AddLayerModal: React.FC<AddLayerModalProps> = ({ open, form, onOk, onCancel }) => (
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
        label="レイヤーID"
        name="id"
        rules={[{ required: true, message: 'レイヤーIDを入力してください' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="source"
        name="source"
        rules={[{ required: true, message: 'sourceを入力してください' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="source-layer"
        name="sourceLayer"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="filter (JSON形式)"
        name="filter"
        tooltip='例: ["==", "class", "A"]'
      >
        <Input.TextArea rows={2} placeholder='["==", "class", "A"]' />
      </Form.Item>
      <Form.Item
        label="paint (JSON形式)"
        name="paint"
        tooltip='例: {"circle-color": "#ff0000"}'
      >
        <Input.TextArea rows={2} placeholder='{"circle-color": "#ff0000"}' />
      </Form.Item>
      <Form.Item
        label="layout (JSON形式)"
        name="layout"
        tooltip='例: {"icon-image": "my-icon"}'
      >
        <Input.TextArea rows={2} placeholder='{"icon-image": "my-icon"}' />
      </Form.Item>
    </Form>
  </Modal>
);

export default AddLayerModal;
