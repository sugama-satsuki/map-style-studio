import React from 'react';
import { Card, Typography, Input, Button, Space, message } from 'antd';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';
import type { StyleSpecification } from 'maplibre-gl';

const { Title, Text } = Typography;

interface Props {
  savePrevStyle?: (newStyle: StyleSpecification | undefined) => void;
}

const SpriteEditor: React.FC<Props> = ({ savePrevStyle }) => {
  const [style, setStyle] = useAtom(styleAtom);
  const [editing, setEditing] = React.useState(false);

  // spriteはstringまたはstring[]
  const spriteValue = style?.sprite ?? '';
  const isArray = Array.isArray(spriteValue);
  const [inputValue, setInputValue] = React.useState(
    isArray ? (spriteValue as unknown as string[]).join('\n') : (spriteValue as string)
  );

  // spriteが変更されたらinputValueも同期
  React.useEffect(() => {
    if (Array.isArray(style?.sprite)) {
      setInputValue(style.sprite.join('\n'));
    } else {
      setInputValue(style?.sprite ?? '');
    }
  }, [style?.sprite]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSave = () => {
    if (savePrevStyle) savePrevStyle(style);
    // 改行が含まれていれば配列として保存
    const value = inputValue.includes('\n')
      ? inputValue.split('\n').map(s => s.trim()).filter(Boolean)
      : inputValue.trim();
    setStyle({ ...style!, sprite: value });
    setEditing(false);
    message.success('spriteのURLを保存しました');
  };

  const handleCancel = () => {
    if (Array.isArray(style?.sprite)) {
      setInputValue(style.sprite.join('\n'));
    } else {
      setInputValue(style?.sprite ?? '');
    }
    setEditing(false);
  };

  return (
    <Card className="editor-card" size="small">
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Title level={4}>スプライト編集</Title>
        <Text type="secondary">
          style.jsonのsprite設定やスプライト画像のURLを編集できます。複数指定する場合は改行区切りで入力してください。
        </Text>
        {editing ? (
          <Input
            addonBefore="sprite"
            placeholder="スプライトのURLを入力（複数の場合は改行区切り）"
            value={inputValue}
            onChange={handleChange}
          />
        ) : (
          <Input
            addonBefore="sprite"
            value={
              isArray
                ? (spriteValue as unknown as string[]).join('\n')
                : (spriteValue as string)
            }
            readOnly
          />
        )}
        {editing ? (
          <Space>
            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
            <Button onClick={handleCancel}>
              キャンセル
            </Button>
          </Space>
        ) : (
          <Button type="default" onClick={() => setEditing(true)}>
            編集
          </Button>
        )}
      </Space>
    </Card>
  );
};

export default SpriteEditor;
