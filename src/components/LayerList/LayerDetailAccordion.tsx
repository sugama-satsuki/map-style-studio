import React, { useEffect, useState } from 'react';
import { Collapse, Flex, Tooltip, Button, Input, Typography } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import type { LayerSpecification } from 'maplibre-gl';

const { Panel } = Collapse;
const { Text } = Typography;

type Props = {
  layer: LayerSpecification;
  editing: { layerId: string; field: 'filter' | 'paint' | 'layout' | null; value: string } | null;
  onEdit: (field: 'filter' | 'paint' | 'layout') => void;
  onSave: (field: 'filter' | 'paint' | 'layout', value: string) => void;
  onCancel: () => void;
};

const LayerDetailAccordion: React.FC<Props> = ({ layer, editing, onEdit, onSave, onCancel }) => {
  const [localValue, setLocalValue] = useState<string>('');
  const [localEditing, setLocalEditing] = useState<{ layerId: string; field: 'filter' | 'paint' | 'layout' | null } | null>(null);

    useEffect(() => {
        setLocalEditing(editing);
    }, [editing]);

  useEffect(() => {
    if (localEditing?.layerId === layer.id && localEditing?.field) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setLocalValue(JSON.stringify((layer as any)[localEditing.field], null, 2) || '');
    }
    // eslint-disable-next-line
  }, [localEditing?.layerId, localEditing?.field]);

  return (
    <Collapse ghost size="small" style={{ width: '100%', padding: 0 }}>
      {(['filter', 'paint', 'layout'] as const).map(field => (
        <Panel
          header={
            <Flex justify="space-between" align="center">
              <Text strong>{field}</Text>
              <Flex justify="right" align="center" gap={2}>
                {localEditing?.layerId === layer.id && localEditing?.field === field ? (
                  <>
                    <Tooltip title="保存">
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<CheckOutlined />}
                        onClick={() => onSave(field, localValue)}
                      />
                    </Tooltip>
                    <Tooltip title="キャンセル">
                      <Button
                        type="default"
                        shape="circle"
                        icon={<CloseOutlined />}
                        onClick={onCancel}
                      />
                    </Tooltip>
                  </>
                ) : (
                  <Tooltip title="編集">
                    <Button
                      type="default"
                      shape="circle"
                      icon={<EditOutlined />}
                      onClick={() => onEdit(field)}
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
          {localEditing?.layerId === layer.id && localEditing?.field === field ? (
            <Input.TextArea
              value={localValue}
              onChange={e => setLocalValue(e.target.value)}
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

export default LayerDetailAccordion;
