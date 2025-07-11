import React, { useState } from 'react';
import { Button, Card, Input, message, Space, Tooltip } from 'antd';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';

type StyleJsonViewerProps = {
    savePrevStyle: (newStyle: maplibregl.StyleSpecification | undefined) => void
}

const StyleJsonViewer: React.FC<StyleJsonViewerProps> = ({ savePrevStyle }) => {
  const [style, setStyle] = useAtom(styleAtom);
  const [editing, setEditing] = useState(false);
  const [code, setCode] = useState(() => JSON.stringify(style, null, 2));

  // 編集モード切替時に最新のstyleを反映
  const handleEdit = () => {
    setCode(JSON.stringify(style, null, 2));
    setEditing(true);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(code);
      setStyle(parsed);
      setEditing(false);
      message.success('style.jsonを更新しました');
      savePrevStyle(parsed);
    } catch {
      message.error('JSONの形式が正しくありません');
    }
  };

  const handleCancel = () => {
    setCode(JSON.stringify(style, null, 2));
    setEditing(false);
  };

  return (
    <Card className='editor-card' id='layer-editor' size='small'>
      <Space style={{ width: '100%', height: '40px' }} direction="horizontal" align="center">{
        editing ? (
          <>
            <Tooltip title="保存">
              <Button
                type="primary"
                shape="circle"
                icon={<CheckOutlined />}
                onClick={handleSave}
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
              onClick={handleEdit}
            />
          </Tooltip>
        )
      }</Space>
      <div style={{ width: '100%', maxHeight: 'calc(100% - 40px)', overflowY: 'scroll' }}>
        {editing ? (
          <Input.TextArea
            value={code}
            onChange={e => setCode(e.target.value)}
            autoSize={{ minRows: 20 }}
            style={{
              width: '100%',
              fontSize: 14,
              background: '#1e1e1e',
              color: '#fff',
              border: 'none',
            }}
          />
        ) : (
          <SyntaxHighlighter language="json" style={vscDarkPlus}>
            {JSON.stringify(style, null, 2)}
          </SyntaxHighlighter>
        )}
      </div>
    </Card>
  );
};

export default StyleJsonViewer;
