import React, { useState } from 'react';
import { Tabs } from 'antd';
import { generateStyleFromTheme } from '../../utils/generateStyleFromTheme';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';
import ThemeTabContent from './ThemeTabContent';
import CategoryTabContent from './CategoryTabContent';

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
            const newStyle = style;
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
                            <ThemeTabContent
                                colors={colors}
                                setColors={setColors}
                                handleChange={handleChange}
                                generateStyleByTheme={generateStyleByTheme}
                            />
                        ),
                    },
                    {
                        key: 'category',
                        label: 'カテゴリ別',
                        children: (
                            <CategoryTabContent
                                categoryColors={categoryColors}
                                handleCategoryChange={handleCategoryChange}
                                generateStyleByCategory={generateStyleByCategory}
                            />
                        ),
                    }
                ]}
            />
        </div>
    );
};

export default ColorChanger;
