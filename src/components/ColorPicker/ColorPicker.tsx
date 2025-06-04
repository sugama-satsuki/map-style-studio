import React, { useState } from 'react';
import { Space, Typography, ColorPicker as AntdColorPicker, Flex, Button } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ColorPicker: React.FC = () => {
    const [colors, setColors] = useState<string[]>(['#fff']);

    const handleChange = (index: number, color: string) => {
        const newColors = [...colors];
        newColors[index] = color;
        setColors(newColors);
    };

    return (
        <div>
            <Space direction="vertical" size="middle">
                <Text strong>テーマカラーを選択（3色まで）</Text>
                {colors.map((color, idx) => (
                    <Flex key={idx} align="center" justify={'space-between'} gap={8}>
                        <Flex key={idx} align="center" justify={'left'} gap={8}>
                            <Text>テーマカラー {idx + 1}</Text>
                            <AntdColorPicker
                                key={idx}
                                value={color}
                                onChange={(_, hex) => handleChange(idx, hex)}
                                aria-label={`テーマカラー${idx + 1}`}
                            />
                        </Flex>
<Button
      type="dashed"
      shape="circle"
      icon={<CloseOutlined />}
      onClick={() => setColors(colors.filter((_, i) => i !== idx))}
      disabled={colors.length === 1}
    />                    </Flex>
                ))}

                {colors.length < 3 &&
                    <Button icon={<PlusOutlined />} iconPosition='start' onClick={() => {setColors([...colors, '#fff']);}}>
                        テーマカラーを追加
                    </Button>
                }
            </Space>
        </div>
    );
};

export default ColorPicker;
