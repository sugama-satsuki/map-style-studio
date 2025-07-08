import React, { useEffect, useState } from 'react';
import { Collapse, Flex, Tooltip, Button, Input, Typography, Space } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import type { LayerSpecification } from 'maplibre-gl';
import { useColorfulJson } from '../../utils/renderColorfulJson';

const { Panel } = Collapse;
const { Text } = Typography;

type Props = {
  layer: LayerSpecification;
  editing: { layerId: string; field: 'filter' | 'paint' | 'layout' | null; value: string } | null;
  onEdit: (field: 'filter' | 'paint' | 'layout') => void;
  onResetStyle: (field: 'filter' | 'paint' | 'layout') => void;
  onSave: (field: 'filter' | 'paint' | 'layout', value: string) => void;
  onCancel: () => void;
};

const LayerDetailAccordion: React.FC<Props> = ({ layer, editing, onEdit, onResetStyle, onSave, onCancel }) => {
  const [localValue, setLocalValue] = useState<string>('');
  const [localEditing, setLocalEditing] = useState<{ layerId: string; field: 'filter' | 'paint' | 'layout' | null } | null>(null);
  console.log('LayerDetailAccordion', layer, editing);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonStr = JSON.stringify((layer as any)['paint'], null, 2) || '';
  const colorful = useColorfulJson(jsonStr);

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
    <Space direction="vertical" style={{ width: '100%' }} size="small">
      {('source' in layer && layer.source) && 
        <Text strong style={{ padding: '0 36px', lineHeight: '32px', display: 'block'}}> source: {layer.source}</Text>
      }
      {('source-layer' in layer && layer['source-layer'] !== undefined) && 
        <Text strong style={{ padding: '0 36px', lineHeight: '32px', display: 'block'}}> sourceLayer: {String(layer['source-layer'])}</Text>
      }
      <Collapse ghost size="small" style={{ width: '100%', padding: 0 }}>
        {(['filter', 'paint', 'layout'] as const).map(field => {
        return (
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
                  <Tooltip title="リセット">
                    <Button
                      type="default"
                      shape="circle"
                      icon={<ReloadOutlined />}
                      onClick={() => onResetStyle(field)}
                    />
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
                style={{ backgroundColor: '#fbfbfb' }}
              />
            ) : (
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {
                  field === 'paint' ? 
                    colorful 
                  : (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    JSON.stringify((layer as any)[field], null, 2)
                  )
                }
              </pre>
            )}
          </Panel>
        );
        })}
      </Collapse>
    </Space>
  );
};

export default React.memo(LayerDetailAccordion);
