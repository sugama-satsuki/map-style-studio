import React, { useState } from 'react';
import { Modal, Select, Input } from 'antd';

const { Option } = Select;

type ExpressionCreatorProps = {
  open: boolean;
  onClose?: () => void;
};

const ExpressionCreator: React.FC<ExpressionCreatorProps> = ({ open, onClose }) => {
  const [expressionType, setExpressionType] = useState<string>('filter');
  const [expressionStr, setExpressionStr] = useState<string>('');

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      className="expressionCreator"
      title="Expression Creator"
      maskClosable={false}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Select
          id="expressionType"
          value={expressionType}
          onChange={setExpressionType}
          style={{ width: '100%' }}
        >
          <Option value="filter">filter</Option>
          <Option value="paint">paint</Option>
          <Option value="layout">layout</Option>
        </Select>
        <Input
          id="expressionStr"
          value={expressionStr}
          onChange={e => setExpressionStr(e.target.value)}
          placeholder="expressionを入力"
        />
      </div>
    </Modal>
  );
};

export default ExpressionCreator;
