import { Button, ColorPicker, Flex, Space, Typography } from "antd";
import { BgColorsOutlined } from '@ant-design/icons';
import { useState } from "react";
import { useAtom } from "jotai";
import { styleAtom } from "../../atom";
import { generateCategoryColorStyle, type CategoryColors } from "../../utils/generateCategoryColorStyle";

type CategoryColorProps = {
    savePrevStyle: (newStyle: maplibregl.StyleSpecification | undefined) => void
};

const { Text } = Typography;


const CategoryTabContent: React.FC<CategoryColorProps> = ({ savePrevStyle }) => {

    const [categoryColors, setCategoryColors] = useState<CategoryColors>({
        building: '',
        background: '',
        grass: '',
        road: '',
        highway: '',
    });
    const [style, setStyle] = useAtom(styleAtom);


    const handleCategoryChange = (key: keyof CategoryColors, color: string) => {
        setCategoryColors(prev => ({ ...prev, [key]: color }));
    };

    const generateStyleByCategory = async () => {
        if (!style || typeof style !== 'object') return;
        try {
            // categoryColorsの値を使い、
            const newStyle = generateCategoryColorStyle(categoryColors, style);
            console.log('Generated style:', newStyle);
            savePrevStyle(newStyle);
            setStyle(newStyle);
        } catch (e) {
            console.error('スタイル生成に失敗しました', e);
        }
    };
    
    return (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Text strong>各カテゴリの色を指定</Text>
            <Flex align="center" gap={8}>
                <Text>建物</Text>
                <ColorPicker
                    value={categoryColors.building}
                    onChange={(_, hex) => handleCategoryChange('building', hex)}
                />
            </Flex>
            <Flex align="center" gap={8}>
                <Text>背景</Text>
                <ColorPicker
                    value={categoryColors.background}
                    onChange={(_, hex) => handleCategoryChange('background', hex)}
                />
            </Flex>
            <Flex align="center" gap={8}>
                <Text>草原</Text>
                <ColorPicker
                    value={categoryColors.grass}
                    onChange={(_, hex) => handleCategoryChange('grass', hex)}
                />
            </Flex>
            <Flex align="center" gap={8}>
                <Text>道</Text>
                <ColorPicker
                    value={categoryColors.road}
                    onChange={(_, hex) => handleCategoryChange('road', hex)}
                />
            </Flex>
            <Flex align="center" gap={8}>
                <Text>高速道路</Text>
                <ColorPicker
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
    );
};

export default CategoryTabContent;
