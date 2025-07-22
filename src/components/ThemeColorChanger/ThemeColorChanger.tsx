import React, { useState } from 'react';
import { Space, Typography, ColorPicker as AntdThemeColorChanger, Flex, Button, Tabs } from 'antd';
import { BgColorsOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { generateStyleFromTheme } from '../../utils/generateStyleFromTheme';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';

const { Text } = Typography;

type ColorProps = {
    savePrevStyle: (newStyle: maplibregl.StyleSpecification | undefined) => void
}

const defaultThemeColors = ['#fff', '#000', '#888'];
const defaultCategoryColors = {
    building: '#cccccc',
    background: '#ffffff',
    grass: '#a8e063',
    road: '#bbbbbb',
    highway: '#ff9800',
};

const ThemeColorChanger: React.FC<ColorProps> = ({ savePrevStyle }) => {
    const [tab, setTab] = useState<'theme' | 'category'>('theme');
    const [colors, setColors] = useState<string[]>(defaultThemeColors);
    const [categoryColors, setCategoryColors] = useState<{ [key: string]: string }>({ ...defaultCategoryColors });
    const [style, setStyle] = useAtom(styleAtom);

    const handleThemeChange = (index: number, color: string) => {
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
    };

    const generateStyleByCategory = async () => {
        if (!style || typeof style !== 'object') return;
        try {
            const newStyle = await generateStyleFromTheme(
                {
                    building: categoryColors.building,
                    background: categoryColors.background,
                    grass: categoryColors.grass,
                    road: categoryColors.road,
                    highway: categoryColors.highway,
                },
                style
            );
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
                        label: 'テーマカラーで生成',
                        children: (
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Text strong>テーマカラーを選択（3色まで）</Text>
                                {colors.map((color, idx) => (
                                    <Flex key={idx} align="center" justify={'space-between'} gap={8}>
                                        <Flex align="center" justify={'left'} gap={8}>
                                            <Text>テーマカラー {idx + 1}</Text>
                                            <AntdThemeColorChanger
                                                value={color}
                                                onChange={(_, hex) => handleThemeChange(idx, hex)}
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
                        label: '項目ごとに色を指定',
                        children: (
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Text strong>各項目の色を指定</Text>
                                <Flex align="center" gap={8}>
                                    <Text>建物</Text>
                                    <AntdThemeColorChanger
                                        value={categoryColors.building}
                                        onChange={(_, hex) => handleCategoryChange('building', hex)}
                                    />
                                </Flex>
                                <Flex align="center" gap={8}>
                                    <Text>背景</Text>
                                    <AntdThemeColorChanger
                                        value={categoryColors.background}
                                        onChange={(_, hex) => handleCategoryChange('background', hex)}
                                    />
                                </Flex>
                                <Flex align="center" gap={8}>
                                    <Text>草原</Text>
                                    <AntdThemeColorChanger
                                        value={categoryColors.grass}
                                        onChange={(_, hex) => handleCategoryChange('grass', hex)}
                                    />
                                </Flex>
                                <Flex align="center" gap={8}>
                                    <Text>道</Text>
                                    <AntdThemeColorChanger
                                        value={categoryColors.road}
                                        onChange={(_, hex) => handleCategoryChange('road', hex)}
                                    />
                                </Flex>
                                <Flex align="center" gap={8}>
                                    <Text>高速道路</Text>
                                    <AntdThemeColorChanger
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

export default ThemeColorChanger;
