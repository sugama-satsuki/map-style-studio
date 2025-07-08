import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import type { LayerSpecification } from 'maplibre-gl';

type Props = {
  open: boolean;
  onOk: (layer: Partial<LayerSpecification>) => void;
  onCancel: () => void;
};

const AddLayerModal: React.FC<Props> = ({ open, onOk, onCancel }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    onOk(values);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title="レイヤーを追加"
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="追加"
      cancelText="キャンセル"
    >
      <Form form={form} layout="vertical" name="add-layer-form">
        <Form.Item
          label="レイヤーID"
          name="id"
          rules={[{ required: true, message: 'レイヤーIDを入力してください' }]}
        >
          <Input data-testid="layer-id-input" />
        </Form.Item>
        <Form.Item
          label="タイプ"
          name="type"
          rules={[{ required: true, message: 'タイプを選択してください' }]}
        >
          <Select data-testid="layer-type-select">
            <Select.Option value="fill">fill</Select.Option>
            <Select.Option value="line">line</Select.Option>
            <Select.Option value="symbol">symbol</Select.Option>
            <Select.Option value="circle">circle</Select.Option>
            <Select.Option value="background">background</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddLayerModal;
