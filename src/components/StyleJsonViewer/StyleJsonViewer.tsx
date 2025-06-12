import React, { useState } from 'react';
import { Card, Button, message } from 'antd';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
    <Card
      title="style.json ビューア"
      extra={
        editing ? (
          <>
            <Button type="primary" size="small" onClick={handleSave} style={{ marginRight: 8 }}>
              保存
            </Button>
            <Button size="small" onClick={handleCancel}>
              キャンセル
            </Button>
          </>
        ) : (
          <Button size="small" onClick={handleEdit}>
            編集
          </Button>
        )
      }
      id="style-json-viewer"
      style={{ width: '100%', height: '100%', padding: 0 }}
    >
      {editing ? (
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          style={{
            width: '100%',
            height: 350,
            fontFamily: 'monospace',
            fontSize: 14,
            background: '#1e1e1e',
            color: '#fff',
            border: 'none',
            resize: 'vertical',
          }}
        />
      ) : (
        <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ margin: 0, background: '#1e1e1e', height: '100%' }}>
          {JSON.stringify(style, null, 2)}
        </SyntaxHighlighter>
      )}
    </Card>
  );
};

export default StyleJsonViewer;
