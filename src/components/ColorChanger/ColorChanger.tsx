import React, { useState } from 'react';
import { Space, Typography, ColorPicker as AntdColorChanger, Flex, Button, Tabs } from 'antd';
import { BgColorsOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { generateStyleFromTheme } from '../../utils/generateStyleFromTheme';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';

const { Text } = Typography;

type ColorProps = {
    savePrevStyle: (newStyle: maplibregl.StyleSpecification | undefined) => void
}


const ColorChanger: React.FC<ColorProps> = ({ savePrevStyle }) => {
    const [colors, setColors] = useState<string[]>(['#fff']);
    const [categoryColors, setCategoryColors] = useState<{ [key: string]: string }>({ });
    const [style, setStyle] = useAtom(styleAtom);
    const [tab, setTab] = useState<'theme' | 'category'>('theme');


    const handleChange = (index: number, color: string) => {
        const newColors = [...colors];
        newColors[index] = color;
        setColors(newColors);
    };

    const handleCategoryChange = (key: string, color: string) => {
        setCategoryColors(prev => ({ ...prev, [key]: color }));
    };

    const generateStyleByTheme = async () => {
        if (!style || typeof style !== 'object') return;
        try {
            const newStyle = await generateStyleFromTheme(
                { primary: colors[0], secondary: colors[1], tertiary: colors[2] },
                style
            );
            savePrevStyle(newStyle);
            setStyle(newStyle);
        } catch (e) {
            console.error('スタイル生成に失敗しました', e);
        }
    }

    const generateStyleByCategory = async () => {
        if (!style || typeof style !== 'object') return;
        try {
            // ここでカテゴリごとの色を使ってスタイル生成する関数を呼び出す
            // 例: generateCategoryColorStyle(categoryColors, style)
            // 必要に応じてユーティリティ関数を作成してください
            const newStyle = style; // 仮: 実際はカテゴリごとに色を反映したstyleを生成
            savePrevStyle(newStyle);
            setStyle(newStyle);
        } catch (e) {
            console.error('スタイル生成に失敗しました', e);
        }
    };

    return (
        <div>
            <Tabs
                activeKey={tab}
                onChange={key => setTab(key as 'theme' | 'category')}
                items={[
                    {
                        key: 'theme',
                        label: 'テーマ',
                        children: (
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Text strong>テーマカラーを選択（3色まで）</Text>
                                {colors.map((color, idx) => (
                                    <Flex key={idx} align="center" justify={'space-between'} gap={8}>
                                        <Flex align="center" justify={'left'} gap={8}>
                                            <Text>テーマカラー {idx + 1}</Text>
                                            <AntdColorChanger
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
                                        />
                                    </Flex>
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
                        ),
                    },
                    {
                        key: 'category',
                        label: 'カテゴリ別',
                        children: (
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Text strong>各カテゴリの色を指定</Text>
                                <Flex align="center" gap={8}>
                                    <Text>建物</Text>
                                    <AntdColorChanger
                                        value={categoryColors.building}
                                        onChange={(_, hex) => handleCategoryChange('building', hex)}
                                    />
                                </Flex>
                                <Flex align="center" gap={8}>
                                    <Text>背景</Text>
                                    <AntdColorChanger
                                        value={categoryColors.background}
                                        onChange={(_, hex) => handleCategoryChange('background', hex)}
                                    />
                                </Flex>
                                <Flex align="center" gap={8}>
                                    <Text>草原</Text>
                                    <AntdColorChanger
                                        value={categoryColors.grass}
                                        onChange={(_, hex) => handleCategoryChange('grass', hex)}
                                    />
                                </Flex>
                                <Flex align="center" gap={8}>
                                    <Text>道</Text>
                                    <AntdColorChanger
                                        value={categoryColors.road}
                                        onChange={(_, hex) => handleCategoryChange('road', hex)}
                                    />
                                </Flex>
                                <Flex align="center" gap={8}>
                                    <Text>高速道路</Text>
                                    <AntdColorChanger
                                        value={categoryColors.highway}
                                        onChange={(_, hex) => handleCategoryChange('highway', hex)}
                                    />
                                </Flex>
                                <Button
                                    type="primary"
                                    icon={<BgColorsOutlined />}
                                    size='large'
                                    style={{ width: '100%' }}
                                    onClick={generateStyleByCategory}
                                >
                                    style生成
                                </Button>
                            </Space>
                        ),
                    }
                ]}
            />
        </div>
    );
};

export default ColorChanger;
