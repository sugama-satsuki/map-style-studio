import React, { useState } from 'react';
import { Space, Typography, ColorPicker as AntdColorPicker, Flex, Button } from 'antd';
import { BgColorsOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { sendToOpenAI } from '../../utils/generateStyleFromTheme';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';

const { Text } = Typography;

const ColorPicker: React.FC = () => {
    const [colors, setColors] = useState<string[]>(['#fff']);
    const [style, setStyle] = useAtom(styleAtom);

    const handleChange = (index: number, color: string) => {
        const newColors = [...colors];
        newColors[index] = color;
        setColors(newColors);
    };

    const generateStyleByTheme = async () => {
        if (!style) return;
        try {
            const newStyle = await sendToOpenAI(
                { primary: colors[0], secondary: colors[1], tertiary: colors[2] },
                style
            );
            setStyle(newStyle);
        } catch (e) {
            console.error('スタイル生成に失敗しました', e);
        }
    }

    return (
        <div>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
                    <Button icon={<PlusOutlined />} iconPosition='start' onClick={() => { setColors([...colors, '#fff']); }}>
                        カラーを追加
                    </Button>
                }

                <Button 
                    type="primary" 
                    icon={<BgColorsOutlined />} 
                    size='large' 
                    style={{ width: '100%' }} 
                    onClick={generateStyleByTheme}
                >
                    style生成
                </Button>
            </Space>
        </div>
    );
};

export default ColorPicker;
